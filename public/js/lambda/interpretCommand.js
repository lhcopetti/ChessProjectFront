var AWS     = require('aws-sdk');
AWS.config.update({
    region: "us-west-2",
});

var lambda  = new AWS.Lambda();


exports.sendCommand = function(boardInput, pgnCommand, callback) {

    if (pgnCommand === "") {
        alert("An empty command is not allowed!");
        return;
    }

    var dataInput = {"fenBoard" : boardInput,  "pgnCommand" : pgnCommand};
    console.log(boardInput);
    console.log(JSON.stringify(dataInput));

    var params = { 
        FunctionName: 'interpretPGNCommand',
        Payload: JSON.stringify(dataInput)
    };

    lambda.invoke(params, callback);
}