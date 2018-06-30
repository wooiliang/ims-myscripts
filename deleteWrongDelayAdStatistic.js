const Parse = require('parse/node');
const moment = require('moment');

const PARSE_APP_ID = '';
const PARSE_JS_KEY = '';
const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
Parse.serverURL = PARSE_SERVER_URL;

const DelayAdStatistic = Parse.Object.extend('DelayAdStatistic');
const query = new Parse.Query(DelayAdStatistic);
query.greaterThan('createdAt', moment('2017-02-26T16:00:00.000Z').toDate());
query.lessThan('createdAt', moment('2017-02-27T00:00:00.000Z').toDate());
query.limit(200);
query.find().then((statistics) => {
  statistics.forEach((statistic) => {
    console.log(`${statistic.id} => ${statistic.get('createdAt')}`);
    // statistic.destroy();
  });
}).catch((error) => {
  console.error(error);
});
query.count().then((count) => {
  console.log(count);
}).catch((error) => {
  console.error(error);
});
