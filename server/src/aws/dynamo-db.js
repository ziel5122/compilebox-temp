require('dotenv').config();

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-1',
});

module.exports = dynamodb;
