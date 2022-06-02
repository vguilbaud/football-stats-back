const express = require("express");
const router = express.Router();
const commentsCtrol = require("../controllers/comments");
const auth = require("../middleware/auth");

router.post("/getComments", commentsCtrol.getComments);
router.post("/createComment", auth, commentsCtrol.createComment);
router.put("/updateComment", auth, commentsCtrol.updateComment);
router.delete("/deleteComment", auth, commentsCtrol.deleteComment);

module.exports = router;
