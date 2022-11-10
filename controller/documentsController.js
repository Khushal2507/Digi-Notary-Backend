const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const File = require("../models/files");

class Documents {
  getFilebyID = async (req, res) => {
    const { id } = req.params;
    const fileLinks = [];
    const userData = await User.findOne({ _id: id }).populate("files");
    res.json(userData.files);
  };

  allFiles = async (req, res) => {
    const allData = await User.find({}).populate("files");
    res.json(allData);
  };

  uploadFile = async (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const { user } = req.body;
    const { fileName } = req.body;
    const file = new File({
      _id: new mongoose.Types.ObjectId(),
      // user: req.body.fileData.user,
      fileData: url + "/public/" + req.file.filename,
      user: user,
      name: fileName,
    });
    // const userData = await User.findById(user).catch((e) => console.log(e));
    const userData = await User.findByIdAndUpdate(user, {
      $push: { files: file.id },
    });
    console.log(userData);

    await file
      .save()
      .then((result) => {
        res.status(201).json({
          message: "File Uploaded",
          fileUpload: {
            _id: result._id,
            fileData: result.fileData,
          },
        });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  };
}

module.exports = Documents;
