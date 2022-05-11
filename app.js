const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.post("/user", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "Objet créé !" });
  next();
});

app.get((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/creds", (req, res, next) => {
  const stuff = { host: process.env.API_HOST, key: process.env.API_KEY };
  res.status(200).json(stuff);
});

module.exports = app;
