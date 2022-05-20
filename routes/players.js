const express = require("express");
const router = express.Router();

const playerCtrl = require("../controllers/players");

router.use("/", playerCtrl.getTeamPlayers);

module.exports = router;
