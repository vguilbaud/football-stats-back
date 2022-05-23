const axios = require("axios").default;
require("dotenv").config();

const URL = "https://api-football-v1.p.rapidapi.com/v3";

const APIheaders = {
  "X-RapidAPI-Host": process.env.API_HOST,
  "X-RapidAPI-Key": `${process.env.API_KEY}`,
};

exports.getTeamInformation = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/teams`,
    params: { id: req.params.teamId },
    headers: APIheaders,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.response[0]);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getTeamStatistics = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/teams/statistics`,
    params: {
      team: req.params.teamId,
      season: req.query.season,
      league: req.query.league,
    },
    headers: APIheaders,
  };

  axios
    .request(options)
    .then((response) => {
      let stats = response.data.response;
      res.json({
        matches: stats.fixtures.played.total,
        victories: stats.fixtures.wins.total,
        draws: stats.fixtures.draws.total,
        loses: stats.fixtures.loses.total,
        goals: stats.goals.for.total.total,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
