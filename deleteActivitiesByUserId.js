const Parse = require('parse/node');

const PARSE_APP_ID = '';
const PARSE_JS_KEY = '';
const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
Parse.serverURL = PARSE_SERVER_URL;

const Activity = Parse.Object.extend('Activity');
const query = new Parse.Query(Activity);
const user = new Parse.User();
user.id = 'bvGZazvv9Q';
query.equalTo('userId', user);
query.equalTo('activityType', 'sold');
query.limit(1000);
query.find().then((activities) => {
  activities.forEach((activity) => {
    console.log(activity.id);
    activity.destroy();
  });
}).catch((error) => {
  console.error(error);
});
query.count().then((count) => {
  console.log(count);
}).catch((error) => {
  console.error(error);
});
