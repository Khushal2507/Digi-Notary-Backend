const express = require("express");
const app = express();
const appController = require("./controller/appController");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.routes");
const api = require("./routes/files.routes");
const dotenv = require("dotenv");
dotenv.config();

app.listen(3001, (req, res) => {
  console.log("Server listening on port 3001");
});

mongoose.connect(
  process.env.MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully Connected");
    }
  }
);

app.use(express.urlencoded({ urlencoded: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/public", express.static("public"));
app.use("/api", api);
app.use("/user", userRoute);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/upload/files", (req, res) => {});
