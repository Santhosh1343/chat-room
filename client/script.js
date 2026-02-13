console.log("script.js loaded");

const socket = io("http://localhost:3000");

let currentRoom = "";

// Confirm socket connection
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

function joinChat() {
  const username = document.getElementById("username").value;
  const room = document.getElementById("room").value;

  if (!username || !room) {
    alert("Enter name and room");
    return;
  }

  currentRoom = room;

  socket.emit("joinRoom", { username, room });

  document.getElementById("join-container").style.display = "none";
  document.getElementById("chat-container").style.display = "block";
}

function sendMessage() {
  const messageInput = document.getElementById("message");
  const message = messageInput.value;

  if (!message) return;

  socket.emit("sendMessage", {
    room: currentRoom,
    message,
  });

  messageInput.value = "";
}

socket.on("chatMessage", (data) => {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><b>${data.user}:</b> ${data.message}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("message", (msg) => {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><i>${msg}</i></p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("roomUsers", (users) => {
  const usersList = document.getElementById("users");
  usersList.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    usersList.appendChild(li);
  });
});
