const { instrument } = require('@socket.io/admin-ui');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = require('./app');

require('dotenv').config();

const httpServer = createServer(app);
const io = new Server (httpServer, {
    cors: {
        origin: ['http://localhost:8080', 'https://admin.socket.io'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

//admin-ui
instrument(io, { auth: false });

//when connect send chat (edit this)
io.on('connection', socket => {

    socket.on('set-id', (roomID) => {
        socket.join(roomID);
        console.log('room joined')
    })

    //TODO
    socket.on('send-message', (message, storedID) => {
        socket.broadcast.to(storedID).emit('recieve-message', message); //TODO implement encrypt
    })
});

//Start server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// LATER USE
//namespace
const userIo = io.of('/user');
userIo.on('connection', socket => {
    console.log(`connected to user namespace ${socket.username}`);
});

//user
userIo.use((socket, next) => {
    if (socket.handshake.auth.token) {
        socket.username = getUsernameFromToken(socket.handshake.auth.token);
        next();
    }
    else{
        next(new Error('Please send token'));
    }
});

//userfunction
function getUsernameFromToken(token){
    return token;   
}
