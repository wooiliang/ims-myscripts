var aws = require('aws-sdk');
var sqs = new aws.SQS({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'ap-southeast-1'
});

var messageAd = (data, sqsQueue) => {
  var params = {
    MessageBody: JSON.stringify(data),
    QueueUrl: 'https://sqs.ap-southeast-1.amazonaws.com/' + '' + '/' +
      sqsQueue
  };

  sqs.sendMessage(params, (err) => {
    if (err) {
      console.error(err, err.stack);
    } else {
      console.log(params);
    }
  });
};

module.exports = messageAd;
