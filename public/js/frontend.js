function sendCommand()
{
    var command = $('#pgn-command').val();
    var fenBoard = $('#fen-board').text();

    if (command === "") {
        alert("An empty command is not allowed!");
        return;
    }

    var url = "https://2od867bsib.execute-api.us-west-2.amazonaws.com/prod";
    var dataInput = {"fenBoard" : fenBoard,  "pgnCommand" : command};
    /*
    $.post(url, dataInput, function(dataOutput, textStatus) {

        alert("Text status is: " + textStatus);
        alert("DataOut is: " + dataOutput);


    }, "json");
    */

    var req = createRequest();
    req.onreadystatechange = function() { 
        if (req.readyState != 4) return;

        if (req.status != 200) {
            alert("Erro!");
            return;
        }


        var resp = req.responseText;
        var jsonObj = JSON.parse(resp);

        if (jsonObj.errorCode !== 0)
            alert("Deu erro: " + jsonObj.errorMessage);
        else
        {
            $('#fen-board').text(jsonObj.fenBoardOutput);
        }
    };
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(dataInput));
}

function createRequest() {

    return new XMLHttpRequest();
/*    if (typeof xmlhttp.overrideMimeType != 'undefined') {
      result.overrideMimeType('text/xml'); // Or anything else
    }
  }
  else if (window.ActiveXObject) {
    // MSIE
    result = new ActiveXObject("Microsoft.XMLHTTP");
  } 
  else {
    // No known mechanism -- consider aborting the application
  }
  return result;
*/
}