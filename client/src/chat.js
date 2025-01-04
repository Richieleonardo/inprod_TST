import { io } from "socket.io-client";

// DOM Elements

// POP UP
// Get elements
const showPopupBtn = document.getElementById('openBtn');
const closePopupBtn = document.getElementById('closeBtn');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const userForm = document.getElementById('userForm');
const othersId = document.getElementById('others-id');
const usersList = document.getElementById('user-list');

// Show popup when button is clicked
showPopupBtn.addEventListener('click', function() {
  popup.style.display = 'block';
  overlay.style.display = 'block';
});

// Close popup
closePopupBtn.addEventListener('click', function() {
  popup.style.display = 'none';
  overlay.style.display = 'none';
});

// Handle form submission
userForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const userId = document.getElementById('userId').value;
  const userName = document.getElementById('userName').value;

  // Add new user to the list
  const li = document.createElement('li');
  li.textContent = `User ID: ${userId}, Name: ${userName}`;
  li.dataset.userId = userId;
  li.dataset.userName = userName;

  li.addEventListener('click', function() {
    othersId.textContent = `You are chatting with ${li.dataset.userName}`;
    sessionStorage.setItem('receiverID', li.dataset.userId);
    socket.emit('set-id', li.dataset.userId);
    document.getElementById('message-container').innerHTML = '';

  });

  usersList.appendChild(li);

  //Store the new user
  console.log({userId, userName}); //DEBUG

  // Close the popup
  userForm.reset();
  popup.style.display = 'none';
  overlay.style.display = 'none';
});


//chat.html
const roomInput = document.getElementById("room-input");
const joinButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const form = document.getElementById("form");

//Initialization
const socket = io('http://localhost:3000');
const userSocket = io('http://localhost:3000/user', { auth: { token: 'Test' }});

const yourID = sessionStorage.getItem('userId');;
// socket.on('connect', () => {
//   displayMessage(`You connected with id: ${yourID} `);
// });

userSocket.on('connect_error', error => {
  displayMessage(error);
})

//GET UUID
if(yourID != null){
  document.getElementById('your-id').innerText = "your id is " + yourID;
  socket.emit('set-id', yourID);
}

socket.on('recieve-message', async (message) => {
  //Decrypt message
  const decryptedMessage = await decryptMessage(message);
  displayMessage(decryptedMessage);
})

//to send message
form.addEventListener("submit", async e => {
  e.preventDefault();
  const message = messageInput.value;

  if (message === ""){
    return;
  }

  //Display message locally
  displayMessage(message);

  //Encrypt message before sending
  const encryptedMessage = await encryptMessage(message);

  const receiverID = sessionStorage.getItem('receiverID');
  socket.emit('send-message', encryptedMessage, receiverID); //TODO implement decrypt
  messageInput.value = "";
})

// for displaying message not sending
function displayMessage(message){
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
}

// for encrypting message
async function encryptMessage(message){
  const apiKey = "furina_e2aa10b4a8574bc9bad09d242ce2e7e0";
  const response = await fetch("http://localhost:3000/api/encrypt", {
    method: "POST",
    headers: {
      "furina-is-so-beautiful": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: message,
      sensitivity: "medium"
    })
  });
  const data = await response.json();
  return data;  // Returns {key_id, cipher_text, iv}
}

// for decrypting message

async function decryptMessage(encryptedMessage){
  const apiKey = "furina_b6144fb380c64ac5b7876346bf35e6ab";  // Different API key for decryption
  const response = await fetch("http://localhost:3000/api/decrypt", {
    method: "POST",
    headers: {
      "furina-is-so-beautiful": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      key_id: encryptedMessage.key_id,
      cipher_text: encryptedMessage.cipher_text,
      iv: encryptedMessage.iv
    })
  });
  const data = await response.json();
  return data.text;  // Decrypted message
}