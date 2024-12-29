

//HOME.html
import { v4 as uuidv4 } from 'uuid';

document.getElementById('generate-id').addEventListener('click', function() {
  const newID = uuidv4();
  localStorage.setItem('userID', newID);
  window.location.href = 'chat.html';
});

//handle register and login button
document.getElementById('register').addEventListener('click', function() {
  window.location.href = 'register.html';
});

document.getElementById('login').addEventListener('click', function() {
  window.location.href = 'login.html';
});


