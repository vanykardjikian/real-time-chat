const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)


io.on('connection', (socket) => {
	if (!socket.data.username) {
		socket.data.username = 'Anonymous'
	}

	socket.on("hasConnectedServer", username => {
		io.emit('hasConnected', username)
	})

    socket.on('disconnect', () => {
      	io.emit('hasDisconnected', socket.data.username)
      	console.log(`${socket.data.username} disconnected`);
    });
	
    socket.on('setUsername', username => {
      	socket.data.username = username;
    });

    socket.on('chat', (user, msg) => {
      	console.log("user " + user)
      	console.log("msg " + msg)
      	io.emit('chat', user, msg)
    })

});

app.use(express.static('./methods-public'))

/*app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
*/

server.listen(3000, () => {
    console.log('Server is listening on port 3000...')
})
