const AWS = require('aws-sdk');
const AWS_COGNITO = require('amazon-cognito-identity-js');

const COGNITO_REGION = '';
const COGNITO_USER_POOL_ID = '';
const COGNITO_CLIENT_ID = '';
const COGNITO_IDENTITY_POOL_ID = '';

const signUp = (data) => {
  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID
    };
    const userPool = new AWS_COGNITO.CognitoUserPool(poolData);
    const attributeList = [];
    const dataEmail = {
      Name: 'email',
      Value: data.email
    };
    const attributeEmail = new AWS_COGNITO.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);
    attributeList.push(new AWS_COGNITO.CognitoUserAttribute({
      Name: 'given_name',
      Value: data.firstName
    }));
    attributeList.push(new AWS_COGNITO.CognitoUserAttribute({
      Name: 'family_name',
      Value: data.lastName
    }));
    userPool.signUp(data.username, data.password, attributeList, null, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.user.username);
      }
    });
  });
};

signUp({
  email: '',
  firstName: '',
  lastName: '',
  username: '',
  password: ''
}).then((username) => {
  console.log(username);
}).catch((err) => {
  console.error(err);
});
