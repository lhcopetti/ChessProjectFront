var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var dynamoDB = new AWS.DynamoDB();

var params = {
    TableName: "Movies",
    KeySchema: [
        {AttributeName: "year", KeyType: "HASH"},
        {AttributeName: "title", KeyType: "RANGE"}
    ],
    AttributeDefinitions: [
        {AttributeName: "year", AttributeType: "N"},
        {AttributeName: "title", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamoDB.createTable(params, function(err, data) {
    if (err) {
        console.error ("Unable to create table. Error: " + JSON.stringify(err, null, 2));
        return;
    }

    console.log("Created table. Table descrition JSON: " + JSON.stringify(data, null, 2));

});