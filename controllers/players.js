const axios = require("axios").default;
require("dotenv").config();

const URL = "https://api-football-v1.p.rapidapi.com/v3";

const APIheaders = {
  "X-RapidAPI-Host": process.env.API_HOST,
  "X-RapidAPI-Key": `${process.env.API_KEY}`,
};

exports.getTeamPlayers = async (req, res) => {
  let totalPages = 1;
  let pagination = 1;

  let dataFormater = (arr) => {
    return [
      ...arr.map((playerStats) => {
        return {
          id: playerStats.player.id,
          name: playerStats.player.name,
          photo: playerStats.player.photo,
          position: playerStats.statistics[0].games.position,
          nationality: playerStats.player.nationality,
          games: playerStats.statistics
            .map((league) => {
              return league.games.appearences;
            })
            .reduce((total, val) => {
              return total + val;
            }, 0),
          goals: playerStats.statistics
            .map((league) => {
              return league.goals.total;
            })
            .reduce((total, val) => {
              return total + val;
            }, 0),
          assists: playerStats.statistics
            .map((league) => {
              return league.goals.assists;
            })
            .reduce((total, val) => {
              return total + val;
            }, 0),
          yellows: playerStats.statistics
            .map((league) => {
              return league.cards.yellow;
            })
            .reduce((total, val) => {
              return total + val;
            }, 0),
          reds: playerStats.statistics
            .map((league) => {
              return league.cards.red;
            })
            .reduce((total, val) => {
              return total + val;
            }, 0),
        };
      }),
    ];
  };

  let formatOptions = (pagination) => {
    let options = {
      method: "GET",
      url: `${URL}/players`,
      params: {
        team: req.query.team,
        season: req.query.season,
        page: pagination.toString(),
      },
      headers: APIheaders,
    };
    return options;
  };

  await axios
    .request(formatOptions(1))
    .catch((err) => console.log(err))
    .then((response) => {
      totalPages = response.data.paging.total;
      return dataFormater(response.data.response);
    })
    .then(async (response) => {
      let players = [];
      players.push(...response);
      for (let i = pagination + 1; i < totalPages + 1; i++) {
        await axios
          .request(formatOptions(i))
          .then((response) => {
            return dataFormater(response.data.response);
          })
          .then((response) => {
            players.push(...response);
            return;
          });
      }
      return Promise.all(
        players
          .map((player, i, arr) => {
            let duplicate = arr.find(
              (pl, ind) => pl.id === player.id && ind !== i
            );
            if (duplicate) {
              arr.splice([arr.indexOf(duplicate)], 1);
            }
            return player;
          })
          .filter((player) => player.id && player.games > 0)
      );
    })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getPlayerStats = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/players/seasons`,
    params: {
      player: req.params.playerId,
    },
    headers: APIheaders,
  };

  axios
    .request(options)
    .then((response) => {
      return response.data.response;
    })
    .then(async (resp) => {
      let formatOptions = (year) => {
        return {
          method: "GET",
          url: `${URL}/players`,
          params: {
            id: req.params.playerId,
            season: year.toString(),
          },
          headers: APIheaders,
        };
      };
      let positions = [];
      let playerInfos = {
        name: "",
        age: 0,
        height: "",
        nationality: "",
        photo: "",
        position: "",
      };
      let total = {
        appearences: 0,
        goals: 0,
        assists: 0,
        yellows: 0,
        reds: 0,
      };
      let stats = await resp.map(async (year, i) => {
        let totalYear = {
          appearences: 0,
          goals: 0,
          assists: 0,
          yellows: 0,
          reds: 0,
        };
        const resp = await axios.request(formatOptions(year));
        let infos = resp.data.response[0];
        return {
          year: `${year.toString()} - ${(year + 1).toString()}`,
          statsLeague: infos.statistics
            .filter((leagueGiven) => leagueGiven.games.appearences > 0)
            .map((leagueGiven_1, ind, arr) => {
              let duplicate = arr.find(
                (leag, index) =>
                  (leag.league.id === leagueGiven_1.league.id ||
                    leag.league.name === leagueGiven_1.league.name) &&
                  index !== ind
              );
              if (duplicate) {
                arr.splice([arr.indexOf(duplicate)], 1);
              }

              totalYear.appearences += leagueGiven_1.games.appearences;
              totalYear.goals += leagueGiven_1.goals.total;
              totalYear.assists += leagueGiven_1.goals.assists;
              totalYear.yellows += leagueGiven_1.cards.yellow;
              totalYear.reds += leagueGiven_1.cards.red;

              total.appearences += leagueGiven_1.games.appearences;
              total.goals += leagueGiven_1.goals.total;
              total.assists += leagueGiven_1.goals.assists;
              total.yellows += leagueGiven_1.cards.yellow;
              total.reds += leagueGiven_1.cards.red;

              positions.push(leagueGiven_1.games.position);

              // Get missing information
              if (!playerInfos.name && infos.player.name) {
                playerInfos.name = infos.player.name;
              }
              if (!playerInfos.age && infos.player.age) {
                playerInfos.age = infos.player.age;
              }
              if (!playerInfos.nationality && infos.player.nationality) {
                playerInfos.nationality = infos.player.nationality;
              }
              if (!playerInfos.photo && infos.player.photo) {
                playerInfos.photo = infos.player.photo;
              }
              if (!playerInfos.height && infos.player.height) {
                playerInfos.height = infos.player.height.substring(0, 3);
              }

              return {
                league: {
                  id: leagueGiven_1.league.id,
                  name: leagueGiven_1.league.name,
                  logo: leagueGiven_1.league.logo
                    ? leagueGiven_1.league.logo
                    : "",
                },
                statistics: {
                  appearences: leagueGiven_1.games.appearences
                    ? leagueGiven_1.games.appearences
                    : 0,
                  goals: leagueGiven_1.goals.total
                    ? leagueGiven_1.goals.total
                    : 0,
                  assists: leagueGiven_1.goals.assists
                    ? leagueGiven_1.goals.assists
                    : 0,
                  yellows: leagueGiven_1.cards.yellow
                    ? leagueGiven_1.cards.yellow
                    : 0,
                  reds: leagueGiven_1.cards.red ? leagueGiven_1.cards.red : 0,
                },
              };
            })
            .filter((leagueGiven_2) => leagueGiven_2.league),
          totalYear: { ...totalYear },
        };
      });
      let leagueStats = await Promise.all(stats);
      playerInfos.position = positions
        .sort(
          (a, b) =>
            positions.filter((p) => p === a.length) -
            positions.filter((p) => p === b.length)
        )
        .pop();
      return {
        playerInfos,
        stats: leagueStats,
        total,
      };
    })
    .then((final) => {
      res.json(final);
    });
};

exports.getPlayerTransfers = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/transfers`,
    params: {
      player: req.params.playerId,
    },
    headers: APIheaders,
  };

  axios.request(options).then((response) => {
    if (response.data.response.length > 0) {
      res.json(response.data.response[0]);
    } else {
      res.json([]);
    }
  });
};
