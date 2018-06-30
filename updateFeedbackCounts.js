const Parse = require('parse/node');

// initialize parse
Parse.initialize('', null, '');
Parse.serverURL = '';

const Feedback = Parse.Object.extend('Feedback');
const query = new Parse.Query(Feedback);
query.limit(1000);
const promises = [];
query.find().then((feedbacks) => {
  feedbacks.forEach((feedback) => {
    promises.push(getFeedbackCountsByUser(feedback.get('feedbackTo')));
  });
}).then(() => {
  return Promise.all(promises);
}).then(() => {
  console.log('DONE');
}).catch((err) => {
  console.error(err);
});

const getFeedbackCountsByUser = (user) => {
  return new Promise((resolve, reject) => {
    const Feedback = Parse.Object.extend('Feedback');
    const query = new Parse.Query(Feedback);
    // const user = Parse.User;
    const feedbackCounts = {
      Good: 0,
      Neutral: 0,
      Bad: 0
    };
    // user.id = userId;
    query.equalTo('feedbackTo', user)
    query.each((feedback) => {
      feedbackCounts[feedback.get('rating')] += 1;
    }).then(() => {
      return updateFeedbackCount(user.id, feedbackCounts);
    }).then(() => {
      console.log(user.id);
      console.log(feedbackCounts);
      resolve(feedbackCounts);
    }).catch((err) => {
      reject(err);
    });
  });
};

const updateFeedbackCount = (userId, feedbackCounts) => {
  return new Promise((resolve, reject) => {
    const query = new Parse.Query(Parse.User);
    query.get(userId).then((user) => {
      user.set('feedbackCounts', feedbackCounts);
      return user.save(null, { useMasterKey: true });
    }).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};
