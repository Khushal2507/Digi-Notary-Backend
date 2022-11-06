const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");

const DIR = "./public";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only PDFS format allowed!"));
    }
  },
});

const File = require("../models/files");

router.get("/getFiles/:id", async (req, res) => {
  const { id } = req.params;
  const fileLinks = [];
  const userData = await User.findOne({ _id: id }).populate("files");
  // console.log(userData);
  // for (let i = 0; i < userData.files.length; i++) {
  //   const file = await File.findOne({ _id: userData.files[i] });
  //   fileLinks.push(file.fileData);
  // }
  res.json(userData.files);
});

router.get("/allFiles", async (req, res) => {
  const allData = await User.find({}).populate("files");
  res.json(allData);
});

router.post(
  "/uploadFile",
  upload.single("fileData"),
  async (req, res, next) => {
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
  }
);
module.exports = router;
