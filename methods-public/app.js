let socket = io();
let messageForm = document.getElementById("message-container")
let message = document.getElementById("message")
let chat = document.getElementById("chat-container")
let usernameForm = document.getElementById("username-container")
let usernameInput = document.getElementById("username-input")
let username = 'Anonymous'

window.addEventListener('load', () => {
    let sessionUsername =  sessionStorage.getItem("username");
    if (sessionUsername) {
        username = sessionUsername
        socket.emit("setUsername", username)
        usernameInput.value = username
    }
    socket.emit("hasConnected", username)
    console.log(username)
})


// Username form
usernameForm.addEventListener('submit', e => {
    e.preventDefault()
    if (usernameInput.value) {
        let oldUsername = username
        username = usernameInput.value
        socket.emit("setUsername", username)
        socket.emit("changeUsername", oldUsername, username)
        sessionStorage.setItem("username", username);;
    }
})


// Message form
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    if (message.value) {
        socket.emit("chat", username, message.value, false);
        appendMessage('You', message.value, true)
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
/*socket.on("connect", () => {
    socket.emit("hasConnectedServer", username);
});
*/

socket.on('hasConnected', user => {
    let newMessage = document.createElement('P');
    newMessage. setAttribute('id','status-update');
    newMessage.textContent = user +  ' has connected';
    chat.appendChild(newMessage);
    window.scrollTo(0, document.body.scrollHeight);
})

// Disconnect
socket.on('hasDisconnected', user => {
    let newMessage = document.createElement('P');
    newMessage. setAttribute('id','status-update');
    newMessage.textContent = user + ' has disconnected';
    chat.appendChild(newMessage);
    window.scrollTo(0, document.body.scrollHeight);
})

// Change Username
socket.on('changeUsername', (oldUsername, newUsername) => {
    let newMessage = document.createElement('P');
    newMessage. setAttribute('id','status-update');
    newMessage.textContent = oldUsername +' changed their name to ' + newUsername;
    chat.appendChild(newMessage);
    window.scrollTo(0, document.body.scrollHeight);
})

// Chat
socket.on('chat', (user, msg, isSender) => {
    appendMessage(user, msg, isSender)
})

function appendMessage(user, msg, isSender) {
    let newMessageContainer = document.createElement('div');
    newMessageContainer. setAttribute('class','chat-message-container');
    if (isSender) {
        newMessageContainer. setAttribute('id','sender');
    }
    let newMessageUsername = document.createElement('P');
    newMessageUsername. setAttribute('id','chat-message-username');
    newMessageUsername.textContent = user;
    let newMessage = document.createElement('P');
    newMessage. setAttribute('id','chat-message');
    newMessage.textContent = msg;
    newMessageContainer.appendChild(newMessageUsername)
    newMessageContainer.appendChild(newMessage)
    chat.appendChild(newMessageContainer);
    window.scrollTo(0, document.body.scrollHeight);
}


let onlineUsers = document.querySelector('.online-users');
socket.on('updateOnlineUsers', userlist => {
    onlineUsers.innerHTML = ""
    userlist.forEach(user => {
        let newUser = document.createElement('div');
        newUser.setAttribute('id','online-user');
        newUser.innerHTML = "<i class='bx bx-user' ></i>";
        let newUsername = document.createElement('P');
        newUsername.setAttribute('id','online-user-username');
        newUsername.innerText = user;
        newUser.appendChild(newUsername)
        onlineUsers.appendChild(newUser)

    });
        console.log(userlist)
})


// Toggle navbar
let menuIcn1 = document.querySelector('.first#menu-icon')
let onlineUsersBar = document.querySelector('.online-users-container')
menuIcn1.addEventListener('click', () => {
    onlineUsersBar.classList.toggle('active')
})

let menuIcn2 = document.querySelector('.second#menu-icon')
let navbars = document.querySelector('.bars-container')
menuIcn2.addEventListener('click', () => {
    navbars.classList.toggle('active')
})

window.onscroll = () => {
    navbars.classList.remove('active')
    onlineUsersBar.classList.remove('active')
}


document.addEventListener('click', e => {
    console.log(e.target)
    if (!navbars.contains(e.target) && e.target.id != 'menu-icon') {
        navbars.classList.remove('active')
        onlineUsersBar.classList.remove('active')
    }
})