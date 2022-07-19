import AWS from 'aws-sdk';

export default function dynamoDB(action, params)
{   
    AWS.config.update({region: 'us-east-1'});
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    return dynamoDb[action](params).promise();
}