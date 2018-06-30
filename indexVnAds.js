const Parse = require('parse/node');
const algoliasearch = require('algoliasearch');
const client = algoliasearch('', '');

// Parse.initialize('');
// Parse.serverURL = '';
// const index = client.initIndex('vn_ads');
Parse.initialize('');
Parse.serverURL = '';
const index = client.initIndex('vn_staging_ads');

const KUALA_LUMPUR_COORDINATES = {
  lat: 3.1390000,
  long: 101.6869000
};

const convertGeoLocation =  (location, adId) => {
  let latitude = KUALA_LUMPUR_COORDINATES.lat;
  let longitude = KUALA_LUMPUR_COORDINATES.long;
  if (location) {
    latitude = ('latitude' in location) ? location.latitude : KUALA_LUMPUR_COORDINATES.lat;
    longitude = ('longitude' in location) ? location.longitude : KUALA_LUMPUR_COORDINATES.long;
    if (!('latitude' in location) || !('longitude' in location)) {
      console.error(`convertGeoLocation: Empty location for ${adId}`);
    }
  } else {
    console.error(`convertGeoLocation: Location is Null for ${adId}`);
  }
  return {
    lat: latitude,
    lng: longitude
  };
};

const isDefined = (obj) => {
  return typeof obj !== 'undefined';
};

const trimAdForAlgolia = (ad) => {
  const result = {};
  result.objectId = ad.id;
  result.objectID = ad.id;
  result.category = ad.get("category");
  result.subCategory = ad.get("subCategory");
  result.createdBy = {};
  result.createdBy.displayName = ad.get("createdBy").get("displayName");
  result.createdBy.profileImage = ad.get("createdBy").get("profileImage");
  result.createdBy.profileImages = ad.get("createdBy").get("profileImages");
  result.createdBy.objectId = ad.get("createdBy").id;
  result.title = ad.get("title");
  result.description = ad.get("description");
  result.loveCount = ad.get("loveCount");
  result.viewCount = ad.get("viewCount");
  result.price = ad.get("price");
  result.status = ad.get("status");
  result.createdAt = ad.createdAt;
  result.orderWeight = ad.get("orderWeight");
  result.images = ad.get("images");
  // TODO: Random order needs to be removed after we got the ranking algorithm
  result.randomOrder1 = ad.get("randomOrder1");
  result.randomOrder2 = ad.get("randomOrder2");
  result.randomOrder3 = ad.get("randomOrder3");
  if (isDefined(ad.get("isPreloved"))) {
    result.isPreloved = ad.get("isPreloved");
  }
  if (isDefined(ad.get("location"))) {
    result._geoloc = convertGeoLocation(ad.get("location"), ad.id);
  }
  if (isDefined(ad.get("deliveryOption"))) {
    result.deliveryOption = ad.get("deliveryOption");
  }
  if (isDefined(ad.get("size"))) {
    result.size = ad.get("size");
  }
  result.countryCode = 'MY';
  if (isDefined(ad.get('countryCode'))) {
    result.countryCode = ad.get('countryCode').toUpperCase();
  }
  return result;
};

const indexAd = (ad) => {
  return new Promise((resolve, reject) => {
    index.partialUpdateObject(trimAdForAlgolia(ad), (err, content) => {
      if (err) {
        reject(`AlgoliaIndexing error while inserting an adId=${ad.id} : ${err.message}`);
      } else {
        resolve();
      }
    });
  });
};

const Ad = Parse.Object.extend('Ad');
const query = new Parse.Query(Ad);
query.equalTo('countryCode', 'VN');
query.containedIn('status', ['active', 'sold']);
query.each((ad) => {
  indexAd(ad).then(() => {
    console.log(`${ad.id} has been indexed.`);
  }).catch((err) => {
    console.error(err);
  });
}).then(() => {
  console.log('done');
}).catch((err) => {
  console.error(err);
});
