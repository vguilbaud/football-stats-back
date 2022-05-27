const express = require("express");
const router = express.Router();

const teamCtrl = require("../controllers/teams");

router.use("/possibleSeasons/:teamId", teamCtrl.getTeamPossibleSeasons);
router.use("/:teamId/statistics", teamCtrl.getTeamStatistics);
router.use("/:teamId", teamCtrl.getTeamInformation);

module.exports = router;
