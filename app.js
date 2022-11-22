const express = require("express");
const app = express();
// const appController = require("./controller/appController");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.routes");
const api = require("./routes/files.routes");
// const api = require("./routes/documents.routes");
const multer = require("multer");
const File = require("./models/files");
const User = require("./models/user");

const dotenv = require("dotenv");
dotenv.config();

// const Document = require("./controller/documentsController");
// const documentcontroller = new Document();

// const UserClass = require("./controller/userController");
// const userController = new UserClass();

// const Chat = require("./controller/chatController");
// const chatController = new Chat();

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

//documents functions
// app.get("/api/getFiles/:id", documentcontroller.getFilebyID);
// app.get("/api/allFiles", documentcontroller.allFiles);
app.use("/api", api);
app.use("/user", userRoute);
// app.get("/user/:userid", userController.getFilesByUser);
// app.post("/user/login", userController.login);
// app.post("/user/signup", userController.signup);

// app.get("/user/chat/:userid", chatController.getUserForChat);

app.get("/", (req, res) => {
  res.send("hello world");
});

const http = require("http");

const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    // socket.broadcast.emit("receive_message");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

module.exports = server;
