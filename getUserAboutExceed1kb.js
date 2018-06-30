const Parse = require('parse/node');

const PARSE_APP_ID = '';
const PARSE_MASTER_KEY = '';
const PARSE_SERVER_URL = '';
// const PARSE_APP_ID = '';
// const PARSE_MASTER_KEY = '';
// const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID, null, PARSE_MASTER_KEY);
Parse.serverURL = PARSE_SERVER_URL;

let lastTimestamp;

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function getLengthShouldKeep(oriLength, oriBytes) {
  const bytesLimit = 900;
  const keepPercentage = bytesLimit / oriBytes;
  return Math.floor(oriLength * keepPercentage);
}

function testThisUser() {
  const User = Parse.Object.extend('User');
  const queryUser = new Parse.Query(User);
  queryUser.get('EJeS7QYMD0').then((user) => {
    const about = user.get("about");
    const oriBytes = lengthInUtf8Bytes(about);
    const oriLength = about.length;
    const lengthShouldKeep = getLengthShouldKeep(oriLength, oriBytes);
    console.log(`${about.substring(0, lengthShouldKeep)}...`);
  }).catch((err) => {
    console.error(err);
  });
}

function getUserAboutExceed1kb() {
  const User = Parse.Object.extend('User');
  const queryUser = new Parse.Query(User);
  queryUser.exists('about');
  queryUser.notEqualTo('about', '');
  queryUser.limit(1000);
  if (lastTimestamp) {
    queryUser.greaterThan('createdAt', lastTimestamp);
  }
  queryUser.find().then((users) => {
    if (users.length > 0) {
      users.forEach((user, index) => {
        if (user.get('about') && lengthInUtf8Bytes(user.get('about')) > 900) {
          console.log(`${user.get('createdAt')} - ${user.id} - ${lengthInUtf8Bytes(user.get('about'))}`);
          // console.log(user.id);
        }
        if (index = users.length - 1) {
          lastTimestamp = user.get('createdAt');
        }
      });
      getUserAboutExceed1kb();
    }
  }).catch((err) => {
    console.error(err);
  });
  // queryUser.each((user) => {
  //   if (user.get('about') && lengthInUtf8Bytes(user.get('about')) > 900) {
  //     console.log(user.id);
  //   }
  // }).catch((err) => {
  //   console.error(err);
  // });
}

function trimAbout(userId) {
  const User = Parse.Object.extend('User');
  const queryUser = new Parse.Query(User);
  queryUser.get(userId).then((user) => {
    const about = user.get("about");
    const oriBytes = lengthInUtf8Bytes(about);
    const oriLength = about.length;
    if (oriBytes > 900) {
      const lengthShouldKeep = getLengthShouldKeep(oriLength, oriBytes);
      const newAbout = `${about.substring(0, lengthShouldKeep)}...`;
      user.set('about', newAbout);
      return user.save(null, { useMasterKey: true });
    }
  }).catch((err) => {
    console.error(err);
  });
}

// testThisUser();
getUserAboutExceed1kb();
// const updateThese = [
//   'l0GzorpziJ',
//   'VVFx2QhP7O'
// ];
// updateThese.forEach((userId) => {
//   trimAbout(userId);
// });
