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
}

module.exports = Documents;
