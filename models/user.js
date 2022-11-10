const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const File = require("./files");

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  email: String,
  password: String,
  type: String,
  files: { type: [{ type: Schema.Types.ObjectId, ref: "File" }], default: [] },
  hash: { type: [String], default: [] },
});

module.exports = mongoose.model("User", userSchema);
