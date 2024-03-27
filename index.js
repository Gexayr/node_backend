const socket_io = require("socket.io");
const http = require("http");
const express = require('express')
const app = express()
const server = http.createServer(app);
const User = require('./models/user');
const Game = require('./models/game');

module.exports = app;


const io = socket_io(server, {
    cors: {
        origin: '*',
        // origin: 'http://www',
        credentials: true
    }
})

function extractUUID(inputString) {
    const parts = inputString.split(':');
    return parts[parts.length - 1];
}

io.on('connection', async (socket) => {
    const game = new Game(); // House edge of 5%

    socket.on('initUser', async (uuid) => {
        // Example usage
        try {
            if (!uuid) {
                // Create a new user if uid is null
                const newUser = new User('angry rabbit1', 5000);
                socket.emit('userData', await newUser.save());
            } else {
                uuid = extractUUID(uuid);

                // Retrieve user data if uid is provided
                socket.emit('userData', await User.findOne(uuid));
            }
        } catch (error) {
            console.error('Error initializing user:', error);
        }
    });

    socket.on('bet', async (data) => {
        try {
            if(!!data?.step && !!data?.uuid&& !!data?.balance){
                const uuid = extractUUID(data.uuid);

                const user = await User.findOne(uuid);

                const { playerWins, payoutAmount,  amount } = game.play(data);
                console.log(`Player ${playerWins ? 'wins' : 'loses'}! Payout: ${payoutAmount}, Amount: ${amount}`);
                socket.emit('updateUserData', await user.updateData(data, amount));
            } else {
                console.error('there is not uuid or step:', data);
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

