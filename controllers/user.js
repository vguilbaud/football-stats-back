const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const checkEmail = (req) => {
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!req.body.email.match(validRegex)) {
    return { error: "Not a valid password", type: "email" };
  }
  return;
};

const checkPassword = (req) => {
  if (req.body.password === "") {
    return { error: "Please enter a password", type: "password" };
  } else if (
    !/^[A-Za-z0-9]*$/.test(req.body.password) ||
    /\s/g.test(req.body.password)
  ) {
    return {
      error: "Password can only contain numbers and letters",
      type: "password",
    };
  } else if (req.body.password.length < 8 || req.body.password.length > 20) {
    return {
      error: "Password needs to be between 8 and 20 charachters",
      type: "password",
    };
  }
  return;
};

exports.signup = (req, res) => {
  const emailError = checkEmail(req);
  const passwordError = checkPassword(req);

  if (emailError) {
    res.status(400).json(emailError);
  } else if (passwordError) {
    res.status(400).json(passwordError);
  }

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
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((error) => {
          if (error.errors?.email?.kind === "unique") {
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
  const emailError = checkEmail(req);
  const passwordError = checkPassword(req);

  if (emailError) {
    res.status(400).json(emailError);
  } else if (passwordError) {
    res.status(400).json(passwordError);
  }

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
          commentsIds: user.comments,
        });
      })
      .catch((error) => res.status.json({ error }));
  });
};
