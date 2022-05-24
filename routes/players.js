const express = require("express");
const router = express.Router();

const playerCtrl = require("../controllers/players");

router.use("/teamPlayed/:playerId", playerCtrl.getPlayerTransfers);
router.use("/get", playerCtrl.getTeamPlayers);
router.use("/:playerId", playerCtrl.getPlayerStats);

module.exports = router;
