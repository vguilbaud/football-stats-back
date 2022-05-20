const axios = require("axios").default;
require("dotenv").config();

const URL = "https://api-football-v1.p.rapidapi.com/v3";

const APIheaders = {
  "X-RapidAPI-Host": process.env.API_HOST,
  "X-RapidAPI-Key": `${process.env.API_KEY}`,
};

exports.getTeamPlayers = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/players`,
    params: {
      team: req.query.team,
      season: req.query.season,
      page: req.query.page,
    },
    headers: APIheaders,
  };

  axios
    .request(options)
    .then((response) => {
      res.json({
        page: response.data.paging.current,
        totalPages: response.data.paging.total,
        players: response.data.response.map((playerStats) => {
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
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
