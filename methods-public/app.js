let socket = io();
let form = document.getElementById("message-container")
let message = document.getElementById("message")
let chat = document.getElementById("chat-container")

form.addEventListener('submit', e => {
    e.preventDefault()
    if (message.value) {
        socket.emit("chat", message.value);
        message.value = ''
    }
})

socket.on('chat', msg => {
    let newMessage = document.createElement('P');
    newMessage.textContent = msg;
    chat.appendChild(newMessage);
    window.scrollTo(0, document.body.scrollHeight);
})