exports.sendLambda = function(lambdaURL, dataInput, callback)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() { 
        if (req.readyState != 4) return;

        if (req.status != 200) {
            callback("Status NOK: " + req.status, 'undefined');
            return;
        }

        var resp = req.responseText;
        var jsonObj = JSON.parse(resp);

        callback('undefined', jsonObj);
    };
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(dataInput));
}