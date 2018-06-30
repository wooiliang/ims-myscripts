const Parse = require('parse/node');

const PARSE_APP_ID = '';
const PARSE_JS_KEY = '';
const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
Parse.serverURL = PARSE_SERVER_URL;

const Chat = Parse.Object.extend('Chat');
const queryChat = new Parse.Query(Chat);
queryChat.equalTo('isRead', false);
queryChat.equalTo('isEmailSent', false);
queryChat.limit(1000);
queryChat.find().then((chats) => {
  chats.forEach((chat) => {
    console.log(chat.id);
    console.log(chat.get('isEmailSent'));
    chat.set('isEmailSent', true);
    chat.save();
  });
}).catch((error) => {
  console.error(error);
});
// queryChat.count().then((count) => {
//   console.log(count);
// }).catch((error) => {
//   console.error(error);
// });
