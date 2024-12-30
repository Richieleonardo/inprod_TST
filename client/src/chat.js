// DOM Elements
import { io } from "socket.io-client";

//INDEX.html
const roomInput = document.getElementById("room-input");
const joinButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const form = document.getElementById("form");

//Initialization
const socket = io('http://localhost:3000');
const userSocket = io('http://localhost:3000/user', { auth: { token: 'Test' }});

const storedID = localStorage.getItem('userID');
socket.on('connect', () => {
  displayMessage(`You connected with id: ${storedID} `);
});

userSocket.on('connect_error', error => {
  displayMessage(error);
})

//GET UUID
if(storedID != null){
  document.getElementById('your-id').innerText = "your id is " + storedID;
  socket.emit('set-id', storedID);
}

socket.on('recieve-message', message => {
  displayMessage(message);
})

//to send message
form.addEventListener("submit", e => {
  e.preventDefault();
  const message = messageInput.value;

  if (message === ""){
    return;
  }

  displayMessage(message);
  socket.emit('send-message', message, storedID); //TODO implement decrypt
  messageInput.value = "";
})

//joining room
// joinButton.addEventListener("click", () => {
//   const room = roomInput.value;
//   socket.emit('join-room', room, message => {
//     displayMessage(message);
//   });
// })

// for displaying message not sending
function displayMessage(message){
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
}

// let count = 0;
// setInterval(() => {
//   socket.emit("ping", ++count)
// }, 1000);

// document.addEventListener('keydown', e => {
//   if (e.target.matches('input')){
//     return;
//   }
//   if (e.key == "c"){
//     socket.connect();
//   }
//   if (e.key == "d"){
//     socket.disconnect();
//   }
// })