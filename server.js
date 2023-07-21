const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const PORT = process.env.PORT || 3000

async function fetchConnectedSockets() {
	const sockets = await io.fetchSockets();
	const onlineUsers = [];
	sockets.forEach(socket => {
		onlineUsers.push(socket.data.username)
	})
	io.emit('updateOnlineUsers', onlineUsers)
}

io.on('connection', (socket) => {
	if (!socket.data.username) {
		socket.data.username = 'Anonymous'
	}

	socket.on("hasConnected", username => {
		socket.broadcast.emit('hasConnected', username)
		fetchConnectedSockets()
	})

    socket.on('disconnect', () => {
      	io.emit('hasDisconnected', socket.data.username)
      	fetchConnectedSockets()
    });
	
    socket.on('setUsername', (username) => {
      	socket.data.username = username;
    });

	socket.on('changeUsername', (oldUsername, username) => {
		socket.broadcast.emit('changeUsername', oldUsername, username)
		fetchConnectedSockets()
  	});

    socket.on('chat', (user, msg, isSender) => {
      	socket.broadcast.emit('chat', user, msg, isSender)
    });

});

app.use(express.static('./methods-public'))

/*app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
*/

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
})
