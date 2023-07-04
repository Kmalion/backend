console.log('Hola soy el cliente...')

const socket = io();

socket.on('new-message', (data)=>{
    //console.log(data)
})

// Función para agregar un nuevo mensaje al chat
function addMessage(event) {
    event.preventDefault();
    
    const mensaje = {
        user : document.getElementById('username').value,
        message : document.getElementById('text').value
    }
    // Envía el mensaje al servidor
    socket.emit('new-message',  mensaje );

    // Resetea el campo de texto
    document.getElementById('text').value = '';
    
    //return mensaje;
}

// Función para mostrar un mensaje en el chat
function showMessage(message) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <span class="message-author">${message.user}:</span>
        <span class="message-content">${message.message}</span>
    `;
    chatBox.appendChild(messageElement);
}

// Escucha los mensajes del servidor
socket.on('message-all', (message) => {
    showMessage(message);
});

