const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../models/user");

router.post("/login", async (req, res) => {
  const db = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (db) {
    console.log("Found");
    res.json({
      message: true,
      userid: db._id,
    });
  } else {
    console.log("Not Found");
    res.json({
      message: false,
    });
  }
});

router.post("/signup", async (req, res) => {
  const db = await User.find({ email: req.body.email });
  if (db.length > 0) {
    console.log("Email exists");
    res.json({
      message: false,
    });
  } else {
    console.log("new Email");
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: true,
          userDetails: {
            _id: result._id,
            email: result.email,
          },
        });
        // res.send(true);
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  }

  console.log("In signup Route");
  //   console.log(req.body);
  //   res.send("Success");
});

module.exports = router;
