const express = require("express");
const router = express.Router();

const coachsCtrl = require("../controllers/coachs");

router.use("/", coachsCtrl.getCurrentCoach);

module.exports = router;
