const Parse = require('parse/node');
const sqs = require('./sqs');

const PARSE_APP_ID = '';
const PARSE_SERVER_URL = '';
// const PARSE_APP_ID = '';
// const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID);
Parse.serverURL = PARSE_SERVER_URL;

const Ad = Parse.Object.extend('Ad');
const queryAd = new Parse.Query(Ad);
queryAd.exists('mudahAdId');
queryAd.limit(1000);
queryAd.find().then((ads) => {
  console.log(ads.length);
  ads.forEach((ad) => {
    sqs({ adId: ad.id }, 'ads');
  });
}).catch((err) => {
  console.error(err);
});
