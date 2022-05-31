const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        comments: [],
      });
      user
        .save()
        .then(() => res.status(200).json({ message: "User created!" }))
        .catch((error) => {
          if (error.errors.email.kind === "unique") {
            return res
              .status(400)
              .json({ error: "User already exists", type: "email" });
          }
          return res.status(400).json({ error });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({ error: "User not found!", type: "email" });
    }
    bcrypt
      .compare(req.body.password, user.password)
      .then((valid) => {
        if (!valid) {
          return res
            .status(401)
            .json({ error: "Not the right password!", type: "password" });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          }),
          name: user.email.split("@")[0],
        });
      })
      .catch((error) => res.status.json({ error }));
  });
};
