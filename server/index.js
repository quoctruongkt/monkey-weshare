var express = require("express");
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const users = [
  {
    id: "123",
    name: "Hieu",
  },
];

const getUser = (id) => users[id];
let listUser = [];
socketIo.on("connection", (socket) => {
  console.log(socket.handshake.auth);
  const auth = socket.handshake.auth;
  console.log("New client connected" + socket.id);

  socket.emit("getId", socket.id);

  socket.on("create", function (room) {
    console.log(socket.id + " joined to " + room);
    // console.log(room);
    listUser.push({
      socketId: socket.id,
      name: auth.name,
      roomId: room,
      point: 0,
    });
    socket.join(room);
    socketIo.to(room).emit("listUser", { listUser });
  });

  socket.on("sendDataClient", function (data) {
    console.log(data.roomId);
    socketIo.to(data.roomId).emit("sendDataServer", { data });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
    let disconnectedUser = listUser.filter(
      (value) => value.socketId == socket.id
    )[0];
    listUser = listUser.filter((value) => value.socketId != socket.id);
    console.log(listUser);
    if (disconnectedUser) {
      socketIo.to(disconnectedUser.roomId).emit("listUser", { listUser });
    }
  });
});

server.listen(3000, () => {
  console.log("Server đang chay tren cong 3000");
});
