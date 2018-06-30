const Parse = require('parse/node');

const PARSE_APP_ID = '';
const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID);
Parse.serverURL = PARSE_SERVER_URL;

const Ad = Parse.Object.extend('Ad');
const query = new Parse.Query(Ad);
query.get('9Gv9MlJMsJa').then((ad) => {
  console.log(JSON.stringify(ad));
}).catch((err) => {
  console.error(err.message);
});
