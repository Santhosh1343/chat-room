const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
app.use(express.static(path.join(__dirname, "../client")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// room -> [users]
const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    socket.username = username;
    socket.room = room;

    socket.join(room);

    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(username);

    // notify room
    io.to(room).emit("message", `${username} joined the room`);
    io.to(room).emit("roomUsers", rooms[room]);
  });

  socket.on("sendMessage", ({ room, message }) => {
    io.to(room).emit("chatMessage", {
      user: socket.username,
      message,
    });
  });

  socket.on("disconnect", () => {
    const room = socket.room;
    const username = socket.username;

    if (room && rooms[room]) {
      rooms[room] = rooms[room].filter((u) => u !== username);

      io.to(room).emit("message", `${username} left the room`);
      io.to(room).emit("roomUsers", rooms[room]);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
