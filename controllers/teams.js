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
    url: `${URL}/leagues`,
    params: { id: req.params.teamId },
    headers: APIheaders,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
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
      let answer = response.data.response;
      res.json({
        matches: answer.fixtures.played.total,
        victories: answer.fixtures.wins.total,
        draws: answer.fixtures.draws.total,
        loses: answer.fixtures.loses.total,
        goals: answer.goals.for.total.total,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
