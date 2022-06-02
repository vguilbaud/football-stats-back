const mongoose = require("mongoose");
const express = require("express");
const User = require("./models/user");
require("dotenv").config();

const leagueRoutes = require("./routes/leagues");
const teamsRoutes = require("./routes/teams");
const coachsRoutes = require("./routes/coachs");
const playersRoutes = require("./routes/players");
const userRoutes = require("./routes/user");
const commentsRoutes = require("./routes/comments");

mongoose
  .connect(
    `mongodb+srv://vguilbaud:${process.env.DATABASE_PASSWORD}@cluster0.xgusq.mongodb.net/footballStats?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((response) => console.log("Connextion réussie"))
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
app.use("/api/teams", teamsRoutes);
app.use("/api/coach", coachsRoutes);
app.use("/api/players", playersRoutes);
app.use("/auth", userRoutes);
app.use("/comments", commentsRoutes);

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
