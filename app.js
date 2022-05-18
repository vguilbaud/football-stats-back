const mongoose = require("mongoose");
const express = require("express");
const User = require("./models/user");
require("dotenv").config();

const leagueRoutes = require("./routes/leagues");

mongoose
  .connect(
    `mongodb+srv://vguilbaud:${process.env.DATABASE_PASSWORD}@cluster0.xgusq.mongodb.net/footballStats?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((response) => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
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

app.use(express.json());

app.use("/api/leagues", leagueRoutes);

// app.post("/users", (req, res, next) => {
//   delete req.body._id;
//   const user = new User({
//     ...req.body,
//   });
//   user
//     .save()
//     .then(() => {
//       return res.status((201).json({ message: "User enregistré" }));
//     })
//     .catch((error) => {
//       return res.status(400).json({ error });
//     });
// });

// app.use("/users", (req, res, next) => {
//   User.find()
//     .then((users) => res.status(200).json(users))
//     .catch((error) => res.status(400).json({ error }));
// });

// app.use("/api/creds", (req, res, next) => {
//   const stuff = { host: process.env.API_HOST, key: process.env.API_KEY };
//   res.status(200).json(stuff);
//   next();
// });

module.exports = app;
