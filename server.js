const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('chat', msg => {
        io.emit('chat', msg)
        console.log(msg)
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
