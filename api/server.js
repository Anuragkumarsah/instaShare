const express = require("express");
const path = require("path");

const app = express();

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const cors = require("cors");
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  // listens the request for the sender to join to the
  // specified joinId
  socket.on("sender_join", function (data) {
    socket.join(data.sender_uid);
  });

  // listens the request for the receiver to join to the
  // senders joinId and signals the sender that receiver had
  // joined and process can be proceeded
  socket.on("receiver_join", function (data) {
    socket.join(data.receiver_uid);
    socket.in(data.sender_uid).emit("initiate", data.receiver_uid);
  });

  socket.on("share_meta_data", function (data) {
    socket.in(data.receiver_uid).emit("get_meta_data", data.metaData);
  });

  socket.on("file_share_start", function (data) {
    socket.in(data.sender_uid).emit("file_share", {});
  });

  socket.on("share_raw_file", function (data) {
    socket.in(data.receiver_uid).emit("get_raw_file", data.buffer);
  });
});

server.listen(5001, () => console.log("server live"));
