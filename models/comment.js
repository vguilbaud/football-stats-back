const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const commentSchema = mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  commentedId: { type: String, required: true },
  message: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
});

commentSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Comment", commentSchema);
