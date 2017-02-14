function sendCommand()
{
    var command = $('#pgn-command').val();

    if (command === "") {
        alert("An empty command is not allowed!");
        return;
    }

    alert("The command is: " + command);
}