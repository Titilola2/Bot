const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helper");
//const TelegramBot = require('node-telegram-bot-api');
const MY_TOKEN = process.env.TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);
const personalGroupId = '-4156022770';

function sendMessage(chatId, messageText) {
    return axiosInstance
    .get("sendMessage", {
        chat_id: chatId ,
        text: messageText,
    })
    .catch((ex) => {
        errorHandler(ex, "sendMessage", "axios");
    });
}

async function forwardToGroup(chatId, messageText) {
    try {
        const response = await sendMessage(personalGroupId, messageText);
        const message_id = response.data.result.message_id;
        // Forward the message to your personal group
        return axiosInstance.post("sendMessage", {
            chat_id: personalGroupId,
            from_chat_id: chatId,
           text:messageText,
        });
    } catch (ex) {
        errorHandler(ex, "forwardToGroup", "axios");
    }
}





async function handleMessage(messageObj){
    const messageText =messageObj.text || "";
    if (!messageText){
        errorHandler("No message text", "handleMessage");
        return "";
    }

    try{
        const chatId = messageObj.chat.id;
        if (messageText.charAt(0) === "/") {
            const command = messageText.substr(1);
            switch (command){
                case "start":
                    // we want a welcome message to the user
                    return sendMessage(
                        chatId,
                        "Hi! I'm a bot. I can help you with anything"
                    );

                    default:
                        return sendMessage(chatId, "Hey hi, I dont know that command");
            }
        } else {
            return sendMessage(chatId, messageText);
            return forwardToGroup(chatId, messageText);
        }

    } catch (error){
        errorHandler(error, "handleMessage");
    }
}

module.exports = {sendMessage,  handleMessage };