const express = require("express");
const router = express.Router();

const leagueCtrl = require("../controllers/leagues");

// router.use("/:leagueId", leagueCtrl.getLeague);
router.use("/getSeasonsPlayed/:leagueId", leagueCtrl.getSeasonsPlayed);
router.use("/getLeaguesFromTeam", leagueCtrl.getLeaguesPlayedByTeam);
router.use("/:leagueId", leagueCtrl.getTeamsInTheLeague);
router.use("/", leagueCtrl.searchLeague);

module.exports = router;
