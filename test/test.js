const mocha = require("mocha");
const chai = require("chai");
const io = require("socket.io-client");
const server = require("../app");
const socketUrl = "http://localhost:3001";
const chaiHttp = require("chai-http");
const options = {
  transports: ["websocket"],
  "force new connection": true,
};
chai.should();
chai.use(chaiHttp);

const testController = require("../services/utils");

describe("1.) Add File to the System", () => {
  describe("addFile()", () => {
    const file = {
      fileData: "hhttp://localhost:3001/public/experiment-5.pdf",
      user: "63634d463d468c8db2506102",
      name: "Experiment",
    };

    const filelist = [];

    it("Should increase the length of the list", () => {
      let oldLength = filelist.length;
      testController.addFile(filelist, file);

      chai.expect(filelist.length).to.equal(oldLength + 1);
    });
    it("Should have the latest file at the end  of the list", () => {
      let latestFile = file;
      testController.addFile(filelist, file);

      chai.expect(filelist[filelist.length - 2]).to.equal(latestFile);
    });
  });
});

describe("2.) Delete File from the System", () => {
  describe("deleteFile(id)", () => {
    const id = "2";

    const filelist = [
      {
        fileData: "http://localhost:3001/public/experiment-5.pdf",
        user: "63634d463d468c8db2506102",
        name: "Experiment",
        id: "1",
      },
      {
        fileData: "http://localhost:3001/public/srs_updated_removed.pdf",
        user: "63634d463d468c8db2506102",
        name: "File",
        id: "2",
      },
    ];

    it("Should decrease the length of the list", () => {
      let oldLength = filelist.length;
      testController.deleteFile(filelist, id);

      chai.expect(filelist.length).to.be.equal(oldLength - 1);
    });
    it("Should not have the removed file in the list", () => {
      testController.deleteFile(filelist, id);

      chai.expect(filelist[filelist.findIndex((doc) => doc.id == id)]).to.be
        .undefined;
    });
  });
});

describe("3.) Adding New User to tha Admin Panel", () => {
  describe("addUser()", () => {
    const user = {
      username: "Khushal",
      email: "kdhanuka68@gmail.com",
      password: "123",
      files: [],
      type: "user",
    };

    const userList = [];

    it("Should increase the length of the user list in the panel", () => {
      let oldLength = userList.length;
      testController.addUser(userList, user);

      chai.expect(userList.length).to.equal(oldLength + 1);
    });
    it("Should have the latest user at the end of the admin panel", () => {
      let latestFile = user;
      testController.addUser(userList, user);

      chai.expect(userList[userList.length - 2]).to.equal(latestFile);
    });
  });
});

describe("4.) Chat App ", () => {
  it("Should be able to send and receive message", () => {
    const client1 = io.connect(socketUrl, options);
    const client2 = io.connect(socketUrl, options);

    client1.on("connect", () => {
      client1.emit("send_message", {
        author: "Khushal",
        message: "test",
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      });
      client2.on("connect", () => {
        client2.on("receive_message", (data) => {
          return chai.expect(data.message).to.equal("test");
          done();
        });
      });
    });
  });
});
