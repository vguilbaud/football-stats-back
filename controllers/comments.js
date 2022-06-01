const Comment = require("../models/comment");
const User = require("../models/user");

exports.createComment = (req, res) => {
  const comment = new Comment({
    userId: req.body.userId,
    type: req.body.type,
    commentedId: req.body.commentedId,
    message: req.body.comment,
  });

  comment
    .save()
    .then((response) => {
      User.updateOne(
        { _id: response.userId },
        { $addToSet: { comments: [response._id] } }
      )
        .then((reply) => {
          res.status(200).json(reply);
        })
        .catch((err) => {
          res.status(400).json({ err });
        });
    })
    .catch((err) => res.status(500).json({ err }));
};
