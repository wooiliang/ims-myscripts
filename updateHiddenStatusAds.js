const dateFormat = require('dateformat');
const Parse = require('parse/node');

const PARSE_APP_ID = '';
const PARSE_JS_KEY = '';

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

const Ad = Parse.Object.extend('Ad');
const queryAd = new Parse.Query(Ad);
queryAd.equalTo('status', 'hidden');
queryAd.doesNotExist('statusDetails');
queryAd.each((ad) => {
  const date = new Date(2016, 6, 4);
  ad.set('statusDetails', dateFormat(date, 'yyyymmdd'));
  ad.save({
    success: (response) => {
      console.log(`${response.id} is updated.`);
    },
    error: (error) => {
      console.log(error);
    },
  });
}, {
  error: (error) => {
    console.log(error);
  },
});
