var AWS  = require('aws-sdk');

var s3 = new AWS.S3();


var myBucket = 'my-unique-bucket-copetti';
var myKey = 'my-equally-unique-key';

s3.createBucket({Bucket : myBucket}, function(err, data) {

    if (err)
    {
        console.log(err);
        return;
    }


    params = {Bucket: myBucket, Key: myKey, Body: 'Hello!'};
    s3.putObject(params, function(err, data) {

        if (err)
        {
            console.log(err);
            return;
        }

        console.log("Dados enviados com sucesso para " + myBucket + "/" + myKey);
    }
)});