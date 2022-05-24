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
    url: `${URL}/players`,
    params: {
      id: req.params.playerId,
      season: req.query.season,
    },
    headers: APIheaders,
  };

  axios.request(options).then((response) => {
    let infos = response.data.response[0];
    let playerInfo = {
      name: infos.player.name,
      age: infos.player.age,
      photo: infos.player.photo,
      nationality: infos.player.nationality,
    };

    let stats = [];
    let total = {
      games: 0,
      goals: 0,
      assists: 0,
      yellows: 0,
      reds: 0,
    };

    stats = infos.statistics.map((daLeague) => {
      if (daLeague.league.name.includes("Friendlies")) return;
      if (!daLeague.games.appearences) return;

      total.games += daLeague.games.appearences;
      total.goals += daLeague.goals.total;
      total.assists += daLeague.goals.assists;
      total.yellows += daLeague.cards.yellow;
      total.reds += daLeague.cards.red;

      return {
        league: {
          id: daLeague.league.id,
          name: daLeague.league.name,
          logo: daLeague.league.logo,
        },
        statistics: {
          games: daLeague.games.appearences,
          goals: daLeague.goals.total,
          assists: daLeague.goals.assists,
          yellows: daLeague.cards.yellow,
          reds: daLeague.cards.reds,
        },
      };
    });
    res.json({
      playerInfo,
      total,
      stats,
    });
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
    res.json(response.data.response);
  });
};
