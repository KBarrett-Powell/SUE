window.chatroom = new window.Chatroom({
    host: "http://localhost:5052",
    container: document.querySelector(".chat-container"),
    welcomeMessage: "Hi, I am SUE. How may I help you?",
    speechRecognition: "en-UK"
});
window.chatroom.openChat();

function sendUpdateToChat(type, id, name) {
    let messages = window.chatroom.ref.state.messages;
    let botId = messages[0].uuid;
    let now = new Date();

    let discoveredMsg = {
        "message": {
            "type": "text",
            "text": "Discovered New " + type
        },
        "time": now.getTime(),
        "username": "bot",
        "uuid": botId
    };

    let descriptionMsg = {
        "message": {
            "type": "text",
            "text": "\"" + name + "\""
        },
        "time": now.getTime(),
        "username": "bot",
        "uuid": botId
    };

    let buttonMsg = {
        "message":{
            "type":"button",
            "buttons":[{
                "title":"Click Here For Details",
                "payload":"open" + type.replace(/\s+/g, '') + "Details-" + id
            }]
        },
        "time": now.getTime(),
        "username": "bot",
        "uuid": botId
    };

    window.chatroom.ref.state.messageQueue.push(discoveredMsg);
    window.chatroom.ref.state.messageQueue.push(descriptionMsg);
    window.chatroom.ref.state.messageQueue.push(buttonMsg);
};