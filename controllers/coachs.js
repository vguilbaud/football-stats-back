const axios = require("axios").default;
require("dotenv").config();

const URL = "https://api-football-v1.p.rapidapi.com/v3";

const APIheaders = {
  "X-RapidAPI-Host": process.env.API_HOST,
  "X-RapidAPI-Key": `${process.env.API_KEY}`,
};

exports.getCurrentCoach = (req, res) => {
  const options = {
    method: "GET",
    url: `${URL}/coachs`,
    params: { team: req.query.team },
    headers: APIheaders,
  };

  axios
    .request(options)
    .then((response) => {
      let properCoach = response.data.response.filter((coach) => {
        return (
          coach.career.find((period) => {
            return period.team.id === parseInt(req.query.team);
          }).end === null
        );
      });
      res.json(properCoach[0].name);
    })
    .catch((error) => {
      console.log(error);
    });
};
