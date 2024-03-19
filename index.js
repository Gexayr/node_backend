const socket_io = require("socket.io");
const http = require("http");
const express = require('express')
const app = express()
const server = http.createServer(app);
const User = require('./models/user');

module.exports = app;


const io = socket_io(server, {
    cors: {
        origin: '*',
        // origin: 'http://www',
        credentials: true
    }
})

io.on('connection', async (socket) => {

    socket.on('initUser', async (uuid) => {
        try {
            if (!uuid) {
                // Create a new user if uid is null
                const newUser = new User('angry rabbit', 5000);
                socket.emit('userData', await newUser.save());
            } else {
                // Retrieve user data if uid is provided
                socket.emit('userData', await User.findOne(uuid));
            }
        } catch (error) {
            console.error('Error initializing user:', error);
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnected")
    })

})

server.listen(8010, () => {
    console.log(`app listening on port 8010`)
})
