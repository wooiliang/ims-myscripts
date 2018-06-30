'use strict'

const fs = require('fs');
const Parse = require('parse/node');

const PARSE_APP_ID = '';
const PARSE_JS_KEY = '';
const FILE = '';
const CLASS = 'Category';

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

const jsonObjects = JSON.parse(fs.readFileSync(FILE)).results;
const objectArray = [];
for (let i = 0; i < jsonObjects.length; i++) {
  const jsonObject = jsonObjects[i];
  const Object = Parse.Object.extend(CLASS);
  const object = new Object();
  for (let key in jsonObject) {
    if (jsonObject.hasOwnProperty(key) && key !== 'objectId') {
      object.set(key, jsonObject[key]);
    }
  }
  objectArray.push(object);
}
Parse.Object.saveAll(objectArray).then(() => {
  console.log('OK');
}, function (err) {
  console.log(err);
});
