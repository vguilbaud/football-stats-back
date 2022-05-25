const { json } = require("express");

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
        players.map((player, i, arr) => {
          let duplicate = arr.find(
            (pl, ind) => pl.id === player.id && ind !== i
          );
          if (duplicate) {
            player.games += duplicate.games;
            player.goals += duplicate.goals;
            player.assists += duplicate.assists;
            player.yellows += duplicate.yellows;
            player.reds += duplicate.reds;
            arr.splice([arr.indexOf(duplicate)], 1);
          }
          return player;
        })
      );
    })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      console.log(error.message);
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
        const resp = await axios.request(formatOptions(year));
        let infos = resp.data.response[0];
        return {
          year: year.toString(),
          statsLeague: infos.statistics
            .filter(
              (leagueGiven) =>
                !leagueGiven.league.name.includes("Friendlies") &&
                leagueGiven.games.appearences > 0
            )
            .map((leagueGiven_1) => {
              total.appearences += leagueGiven_1.games.appearences;
              total.goals += leagueGiven_1.goals.total;
              total.assists += leagueGiven_1.goals.assists;
              total.yellows += leagueGiven_1.cards.yellow;
              total.reds += leagueGiven_1.cards.red;

              positions.push(leagueGiven_1.games.position);

              if (i === 0) {
                playerInfos.name = infos.player.name;
                playerInfos.age = infos.player.age;
                playerInfos.nationality = infos.player.nationality;
                playerInfos.photo = infos.player.photo;
              }

              return {
                league: {
                  id: leagueGiven_1.league.id,
                  name: leagueGiven_1.league.name,
                  logo: leagueGiven_1.league.logo,
                },
                statistics: {
                  appearences: leagueGiven_1.games.appearences,
                  goals: leagueGiven_1.goals.total,
                  assists: leagueGiven_1.goals.assists,
                  yellows: leagueGiven_1.cards.yellow,
                  reds: leagueGiven_1.cards.red,
                },
              };
            }),
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
      return { playerInfos, leagueStats, total };
    })
    .then((final) => {
      res.json(final);
    });

  // axios.request(options).then((response) => {
  //   console.log(response.data.response);
  //   let infos = response.data.response[0];
  //   let playerInfo = {
  //     name: infos.player.name,
  //     age: infos.player.age,
  //     photo: infos.player.photo,
  //     nationality: infos.player.nationality,
  //   };

  //   let stats = [];
  //   let total = {
  //     games: 0,
  //     goals: 0,
  //     assists: 0,
  //     yellows: 0,
  //     reds: 0,
  //   };

  //   stats = infos.statistics.map((daLeague) => {
  //     if (daLeague.league.name.includes("Friendlies")) return;
  //     if (!daLeague.games.appearences) return;

  //     total.games += daLeague.games.appearences;
  //     total.goals += daLeague.goals.total;
  //     total.assists += daLeague.goals.assists;
  //     total.yellows += daLeague.cards.yellow;
  //     total.reds += daLeague.cards.red;

  //     return {
  //       league: {
  //         id: daLeague.league.id,
  //         name: daLeague.league.name,
  //         logo: daLeague.league.logo,
  //       },
  //       statistics: {
  //         games: daLeague.games.appearences,
  //         goals: daLeague.goals.total,
  //         assists: daLeague.goals.assists,
  //         yellows: daLeague.cards.yellow,
  //         reds: daLeague.cards.reds,
  //       },
  //     };
  //   });
  //   res.json({
  //     playerInfo,
  //     total,
  //     stats,
  //   });
  // });
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
    res.json(response.data.response);
  });
};
