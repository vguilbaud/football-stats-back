const Comment = require("../models/comment");
const User = require("../models/user");

exports.createComment = (req, res) => {
  const comment = new Comment({
    userId: req.body.userId,
    type: req.body.type,
    commentedId: req.body.commentedId,
    message: req.body.comment,
    name: req.body.name,
    date: req.body.date,
  });

  comment
    .save()
    .then((response) => {
      User.updateOne(
        { _id: response.userId },
        { $push: { comments: response._id } }
      )
        .then((reply) => {
          res.status(200).json(response);
          return;
        })
        .catch((err) => {
          res.status(400).json({ err });
        });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

exports.getComments = (req, res) => {
  Comment.find({ type: req.body.type, commentedId: req.body.commentedId })
    .then((comments) => {
      res.json(comments);
    })
    .catch((err) => res.json({ err }));
};

exports.updateComment = (req, res) => {
  Comment.updateOne({ _id: req.body.commentId }, { message: req.body.comment })
    .then((reply) => {
      res.status(200).json({ reply });
    })
    .catch((err) => res.status(400).json({ err }));
};

exports.deleteComment = (req, res) => {
  Comment.deleteOne({ _id: req.body.commentId })
    .then((response) => {
      User.updateOne(
        { _id: req.body.userId },
        { $pull: { comments: req.body.commentId } }
      )
        .then((reply) => {
          res.status(200).json({ reply, response });
        })
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(400).json({ err }));
};
