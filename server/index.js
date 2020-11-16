const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUserInRoom } = require("./users");

const PORT = process.env.PORT || 5001;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, Welcome to the room ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined!` });

    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage");

  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
