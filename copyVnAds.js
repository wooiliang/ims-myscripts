const Parse = require('parse/node');
const fs = require('fs');
const googleTranslate = require('google-translate')('');

const PARSE_APP_ID = '';
const PARSE_SERVER_URL = '';
// const PARSE_APP_ID = '';
// const PARSE_SERVER_URL = '';

Parse.initialize(PARSE_APP_ID);
Parse.serverURL = PARSE_SERVER_URL;

const loadFakeUserIds = () => {
  return new Promise((resolve, reject) => {
    const query = new Parse.Query(Parse.User);
    query.equalTo('isVnFakeUser', true);
    query.find().then((users) => {
      const userIds = users.map((user) => {
        return user.id;
      });
      resolve(userIds);
    }).catch((err) => {
      reject(err);
    });
  });
};

const loadCategoryMappings = () => {
  return new Promise((resolve, reject) => {
    const Category = Parse.Object.extend('Category');
    const query = new Parse.Query(Category);
    query.find().then((categories) => {
      const categoryMappings = {};
      const slugMappings = {};
      categories.forEach((category) => {
        if (!slugMappings[category.get('slug')]) {
          slugMappings[category.get('slug')] = {};
        }
        slugMappings[category.get('slug')][category.get('countryCode')] = category.get('categoryId');
      });
      Object.keys(slugMappings).forEach((slug) => {
        categoryMappings[slugMappings[slug].MY] = slugMappings[slug].VN;
        categoryMappings[slugMappings[slug].VN] = slugMappings[slug].MY;
      });
      resolve(categoryMappings);
    }).catch((err) => {
      reject(err);
    });
  });
};

const loadSubCategoryMappings = (categoryMappings) => {
  return new Promise((resolve, reject) => {
    const SubCategory = Parse.Object.extend('SubCategory');
    const query = new Parse.Query(SubCategory);
    query.find().then((subCategories) => {
      const subCategoryMappings = {};
      const slugMappings = {};
      subCategories.forEach((subCategory) => {
        let parentCategoryId = subCategory.get('parentCategoryId');
        const slug = subCategory.get('slug');
        if (parentCategoryId > 1000) {
          parentCategoryId = categoryMappings[parentCategoryId];
        }
        if (!slugMappings[parentCategoryId]) {
          slugMappings[parentCategoryId] = {};
        }
        if (!slugMappings[parentCategoryId][slug]) {
          slugMappings[parentCategoryId][slug] = {};
        }
        slugMappings[parentCategoryId][slug][subCategory.get('countryCode')] = subCategory.get('subCategoryId');
      });
      Object.keys(slugMappings).forEach((parentCategoryId) => {
        Object.keys(slugMappings[parentCategoryId]).forEach((slug) => {
          if (!subCategoryMappings[parentCategoryId]) {
            subCategoryMappings[parentCategoryId] = {};
          }
          subCategoryMappings[parentCategoryId][slugMappings[parentCategoryId][slug].MY] = slugMappings[parentCategoryId][slug].VN;
        });
      });
      resolve(subCategoryMappings);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getRandomUserId = (userIds) => {
  return userIds[Math.floor((Math.random() * userIds.length) + 0)];
};

const getAdIdsFromFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.replace(/\n$/, '').split('\n'));
      }
    });
  });
};

const getAdById = (adId) => {
  const Ad = Parse.Object.extend('Ad');
  const query = new Parse.Query(Ad);
  return query.get(adId);
};

const getAdsByIds = (adIds) => {
  const promises = [];
  adIds.forEach((adId) => {
    promises.push(getAdById(adId));
  });
  return Promise.all(promises);
};

const translateToVn = (text) => {
  return new Promise((resolve, reject) => {
    googleTranslate.translate(text, 'vi', (err, translation) => {
      if (err) {
        reject();
      } else {
        resolve(translation.translatedText);
      }
    });
  });
};

const handleTitles = (ads, promises) => {
  return new Promise((resolve, reject) => {
    Promise.all(promises).then((titles) => {
      titles.forEach((title, index) => {
        ads[index].set('title', title);
      });
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

const handleDescriptions = (ads, promises) => {
  return new Promise((resolve, reject) => {
    Promise.all(promises).then((descriptions) => {
      descriptions.forEach((description, index) => {
        ads[index].set('description', description);
      });
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

const translateAds = (ads) => {
  const promises = [];
  const promisesTitle = [];
  const promisesDescription = [];
  ads.forEach((ad) => {
    promisesTitle.push(translateToVn(ad.get('title')));
    promisesDescription.push(translateToVn(ad.get('description')));
  });
  promises.push(handleTitles(ads, promisesTitle));
  promises.push(handleDescriptions(ads, promisesDescription));
  return Promise.all(promises);
};

const modifyAds = (ads, fakeUserIds, categoryMappings, subCategoryMappings) => {
  ads.forEach((ad) => {
    const user = new Parse.User();
    user.id = getRandomUserId(fakeUserIds);
    ad.set('createdBy', user);
    ad.set('countryCode', 'VN');
    ad.set('price', ad.get('price') * 5);
    ad.set('location', new Parse.GeoPoint(10.8231, 106.6297));
    ad.set('subCategory', subCategoryMappings[ad.get('category')][ad.get('subCategory')]);
    ad.set('category', categoryMappings[ad.get('category')]);
    ad.set('isVnCopy', true);
    ad.set('loveCount', 0);
    ad.set('status', 'active');
    ad.set('statusDetails', '');
  });
};

const cloneAds = (ads) => {
  const promises = [];
  ads.forEach((ad) => {
    const newAd = ad.clone();
    promises.push(newAd.save());
  });
  return Promise.all(promises);
};

let ads;
let fakeUserIds;
let categoryMappings;
let subCategoryMappings;
loadFakeUserIds().then((fakeUserIds) => {
  this.fakeUserIds = fakeUserIds;
  return loadCategoryMappings();
}).then((categoryMappings) => {
  this.categoryMappings = categoryMappings;
  return loadSubCategoryMappings(this.categoryMappings);
}).then((subCategoryMappings) => {
  console.log(subCategoryMappings);
  this.subCategoryMappings = subCategoryMappings;
  return getAdIdsFromFile('/Users/wooiliang/Desktop/ids');
}).then((adIds) => {
  console.log(adIds);
  return getAdsByIds(adIds);
}).then((ads) => {
  this.ads = ads;
  return translateAds(ads);
}).then(() => {
  console.log(this.ads[0].get('title'));
  console.log(this.ads[0].get('description'));
  modifyAds(this.ads, this.fakeUserIds, this.categoryMappings, this.subCategoryMappings);
  return cloneAds(this.ads);
}).then((newAds) => {
  console.log(newAds);
}).catch((err) => {
  console.error(err);
});
