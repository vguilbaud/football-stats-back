const axios = require("axios").default;
require("dotenv").config();

const URL = "https://api-football-v1.p.rapidapi.com/v3";

const APIheaders = {
  "X-RapidAPI-Host": process.env.API_HOST,
  "X-RapidAPI-Key": `${process.env.API_KEY}`,
};

exports.getLeague = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/leagues`,
    params: { id: req.params.leagueId, season: req.query.season },
    headers: APIheaders,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.searchLeague = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/leagues`,
    params: { search: req.query.search },
    headers: APIheaders,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(
        response.data.response.map((leagueRetrieved) => leagueRetrieved.league)
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getTeamsInTheLeague = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/teams`,
    params: { league: req.params.leagueId, season: req.query.season },
    headers: {
      "X-RapidAPI-Host": process.env.API_HOST,
      "X-RapidAPI-Key": `${process.env.API_KEY}`,
    },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.response.map((resp) => resp.team));
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getLeaguesPlayedByTeam = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/leagues`,
    params: { team: req.query.team, season: req.query.season },
    headers: {
      "X-RapidAPI-Host": process.env.API_HOST,
      "X-RapidAPI-Key": `${process.env.API_KEY}`,
    },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(
        response.data.response
          .filter((daLeague) => !daLeague.league.name.includes("Friendlies"))
          .map((daLeague) => daLeague.league)
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
