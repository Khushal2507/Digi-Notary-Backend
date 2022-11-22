const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const File = require("../models/files");
const testController = require("../services/utils");

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
    let AllFiles;
    try {
      AllFiles = await File.find({});
    } catch (err) {
      console.log(err);
    }
    testController.addFile(AllFiles, file);
    await File.deleteMany({});
    try {
      await File.insertMany(AllFiles);
    } catch (err) {
      console.log(err.message);
    }

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

router.delete("/deleteFiles/:fileid/:userid", async (req, res) => {
  const fileId = req.params.fileid;
  const userid = req.params.userid;
  // console.log(fileId);
  // console.log(userid);
  let AllFiles;
  try {
    AllFiles = await File.find({});
  } catch (err) {
    console.log(err);
  }
  testController.deleteFile(AllFiles, fileId);
  try {
    await File.deleteMany({});
  } catch (err) {
    console.log(err);
  }

  await File.insertMany(AllFiles);

  await User.findByIdAndUpdate(userid, { $pull: { files: fileId } });
  // await File.findByIdAndDelete(fileId);
  res.send("Successful");
});
module.exports = router;
