window.chatroom = new window.Chatroom({
    host: "http://localhost:5052",
    container: document.querySelector(".chat-container"),
    welcomeMessage: "Hi, I am SUE. How may I help you?",
    speechRecognition: "en-US"
    });
window.chatroom.openChat();