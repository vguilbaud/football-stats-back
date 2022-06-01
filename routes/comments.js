const express = require("express");
const router = express.Router();
const commentsCtrol = require("../controllers/comments");
const auth = require("../middleware/auth");

router.post("/", auth, commentsCtrol.createComment);

module.exports = router;
