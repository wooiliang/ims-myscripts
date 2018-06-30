const Parse = require('parse/node');

const PARSE_APP_ID = '';
const PARSE_JS_KEY = '';
const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
Parse.serverURL = PARSE_SERVER_URL;

let count = 0;

function loop(callback) {
  const Queue = Parse.Object.extend('Queue');
  const query = new Parse.Query(Queue);
  query.equalTo('queue', 'response-reminder');
  query.lessThan('clearAfter', new Date());
  query.limit(1000);
  query.find().then((queues) => {
    if (queues.length === 0) {
      callback();
    } else {
      queues.forEach((queue) => {
        console.log(`${queue.id} => ${queue.get('clearAfter')}`);
      });
      return Promise.all(queues.map((queue) => {
        return queue.destroy();
      })).then(() => {
        console.log(`loop ${++count} done`);
        loop(callback);
      });
    }
  }).catch((error) => {
    console.error(error);
  });
}

loop(() => {
  console.log('finish and exit');
});
