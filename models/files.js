const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    fileData: {
      type: String,
    },
    user: { type: String },
    name: { type: String },
  }
  // {
  //   collection: "files",
  // }
);

module.exports = mongoose.model("File", fileSchema);
