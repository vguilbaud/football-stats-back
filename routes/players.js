const express = require("express");
const router = express.Router();

const playerCtrl = require("../controllers/players");

router.use("/teamPlayed/:playerId", playerCtrl.getPlayerTransfers);
router.use("/:playerId", playerCtrl.getPlayerStats);
router.use("/", playerCtrl.getTeamPlayers);

module.exports = router;
