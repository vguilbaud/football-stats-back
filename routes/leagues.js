const express = require("express");
const router = express.Router();
const axios = require("axios").default;
require("dotenv").config();

router.use("/", (req, res, err) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/leagues",
    params: { id: "39", season: "2021" },
    headers: {
      "X-RapidAPI-Host": process.env.API_HOST,
      "X-RapidAPI-Key": `${process.env.API_KEY}`,
    },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
