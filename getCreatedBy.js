const Parse = require('parse/node');

// const PARSE_APP_ID = '';
// const PARSE_SERVER_URL = '';
const PARSE_APP_ID = '';
const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID);
Parse.serverURL = PARSE_SERVER_URL;

const Ad = Parse.Object.extend('Ad');
const queryAd = new Parse.Query(Ad);
// queryAd.equalTo('countryCode', 'VN');
queryAd.include('createdBy');
queryAd.get('GWuuSJwilA').then((ad) => {
  console.log(ad.get("createdBy").get("displayName"));
});
