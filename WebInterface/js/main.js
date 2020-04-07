window.chatroom = new window.Chatroom({
    host: "http://localhost:5052",
    title: "Chat with SAM",
    container: document.querySelector(".chat-container"),
    welcomeMessage: "Hi, I am SAM. How may I help you?",
    speechRecognition: "en-US",
    voiceLang: "en-US"
    });
window.chatroom.openChat();