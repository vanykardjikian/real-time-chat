let socket = io();
let messageForm = document.getElementById("message-container")
let message = document.getElementById("message")
let chat = document.getElementById("chat-container")
let usernameForm = document.getElementById("username-container")
let usernameInput = document.getElementById("username-input")
let username = 'Anonymous'

window.addEventListener('load', () => {
    let user =  JSON.parse(localStorage.getItem("chat-user"));
    if (user) {
        username = user.name
        socket.emit("setUsername", username)
        socket.emit("hasConnected", username)
        usernameInput.value = username
    }
    console.log(username)
})


// Username form
usernameForm.addEventListener('submit', e => {
    e.preventDefault()
    if (usernameInput.value) {
        username = usernameInput.value
        socket.emit("setUsername", username)
        localStorage.setItem("chat-user", JSON.stringify({ 'name': username }));
    }
})


// Message form
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    if (message.value) {
        socket.emit("chat", username, message.value);
        message.value = ''
    }
})

/*let typing = false
messageForm.addEventListener('input', () => {
    if (!typing) {
        console.log('here')
        socket.emit("chat", `${username} is typing...`);
        typing = true
    }
})*/

// Connect
socket.on("connect", () => {
    socket.emit("hasConnectedServer", username);
});


socket.on('hasConnected', user => {
    let newMessage = document.createElement('P');
    newMessage.textContent = user +  ' has connected';
    chat.appendChild(newMessage);
    window.scrollTo(0, document.body.scrollHeight);
})

// Disconnect
socket.on('hasDisconnected', user => {
    let newMessage = document.createElement('P');
    newMessage.textContent = user + ' has disconnected';
    chat.appendChild(newMessage);
    window.scrollTo(0, document.body.scrollHeight);
})

// Chat
socket.on('chat', (user, msg) => {
    let newMessage = document.createElement('P');
    newMessage.textContent = `${user}: ${msg}`;
    chat.appendChild(newMessage);
    window.scrollTo(0, document.body.scrollHeight);
})

