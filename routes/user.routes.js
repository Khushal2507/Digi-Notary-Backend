const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const testController = require("../services/utils");

const User = require("../models/user");

router.get("/getAllUserSideBar", async (req, res) => {
  const data = await User.find({ type: "user" });
  res.json(data);
});

router.get("/:userid", async (req, res) => {
  const userid = req.params.userid;
  const userData = await User.find({ _id: userid }).populate("files");
  res.json(userData[0].files);
});

router.get("/chat/:userid", async (req, res) => {
  const userid = req.params.userid;
  const userData = await User.find({ _id: userid });
  res.json(userData[0]);
});

router.post("/login", async (req, res) => {
  const db = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (db) {
    console.log("Found");
    res.json({
      message: true,
      type: db.type,
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
      type: "user",
    });

    let AllUsers;
    try {
      AllUsers = await User.find({});
    } catch (err) {
      console.log(err);
    }
    testController.addUser(AllUsers, user);
    await User.deleteMany({});
    try {
      await User.insertMany(AllUsers);
    } catch (err) {
      console.log(err);
    }
    // user
    //   .save()
    //   .then((result) => {
    //     res.status(201).json({
    //       message: true,
    //       userDetails: {
    //         _id: result._id,
    //         email: result.email,
    //       },
    //     });
    //     // res.send(true);
    //   })
    //   .catch((err) => {
    //     console.log(err),
    //       res.status(500).json({
    //         error: err,
    //       });
    //   });
  }

  console.log("In signup Route");
  //   console.log(req.body);
  //   res.send("Success");
});

module.exports = router;
