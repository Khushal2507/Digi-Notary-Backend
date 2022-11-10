const mongoose = require("mongoose");
const User = require("../models/user");
const File = require("../models/files");

class Chat {
  getUserForChat = async (req, res) => {
    const userid = req.params.userid;
    const userData = await User.find({ _id: userid });
    res.json(userData[0]);
  };
}

module.exports = Chat;
