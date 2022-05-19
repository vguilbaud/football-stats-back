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
    url: `${URL}/leagues`,
    params: { team: req.params.teamId, season: req.query.season },
    headers: APIheaders,
  };

  let leaguePlayedIds = [];

  axios
    .request(options)
    .then((response) => {
      response.data.response.map((daLeague) => {
        leaguePlayedIds.push(daLeague.league.id);
      });
    })
    .then((response) => {
      let total = { match: 0, goals: 0, victories: 0, draws: 0, defeats: 0 };

      leaguePlayedIds.map((leagueId, i) => {
        axios
          .request({
            method: "GET",
            url: `${URL}/teams/statistics`,
            params: {
              team: req.params.teamId,
              season: req.query.season,
              league: leagueId,
            },
            headers: APIheaders,
          })
          .then((response) => {
            total.match += response.data.response.fixtures.played.total;
            total.goals += response.data.response.goals.for.total.total;
            total.victories += response.data.response.fixtures.wins.total;
            total.draws += response.data.response.fixtures.draws.total;
            total.defeats += response.data.response.fixtures.loses.total;
            if (i === 0) {
              res.json(total);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
      //   res.json(leaguePlayedIds);
    })
    .catch((error) => {
      console.log(error);
    });
};
