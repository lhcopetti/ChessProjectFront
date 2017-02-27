var underscore = angular.module('underscore', []);

underscore.factory('_', ['$window', function() {
    return $window._;
}]);

var app = angular.module('chessProjectApp', ['ngTable', 'underscore']);


app.service('dataPersistance', function($window)
{
    var contentKey = 'APP.dataPersistance';
        
    var setData = function(newObj) { 
        $window.sessionStorage.setItem(contentKey, JSON.stringify(newObj));
    };

    var getData = function() {
        var myData = $window.sessionStorage.getItem(contentKey);

        if (myData)
            myData = JSON.parse(myData);

        return myData || {};
    };

    return {
        setData : setData,
        getData : getData
    };
});

app.service('loginTokenProvider', function($window)
{
    var contentKey = 'APP.SelectedValue';
        
    var setData = function(newObj) { 
        $window.sessionStorage.setItem(contentKey, JSON.stringify(newObj));
    };

    var getData = function() {
        var myData = $window.sessionStorage.getItem(contentKey);

        if (myData)
            myData = JSON.parse(myData);

        return myData || {};
    };

    return {
        setData : setData,
        getData : getData
    };
});

app.controller('loginCtrl', function($scope, $http, $window, loginTokenProvider) 
{
    $scope.app = "ChessProject App";
    console.log($scope.app);



    $scope.attemptLogin = function(loginInfo) 
    {
        console.log("Calling POST");
        $http.post("http://localhost:3000/api/authenticate", loginInfo).success(function(data, status)
        { 
            if (!status || !data.success) {
                $scope.loginAttemptResult = "Erro: " + data.message;
                return;
            }              
            //$scope.loginToken = data.token;
            //loginTokenProvider.setToken(data.token);
            loginTokenProvider.setData({token: data.token, login : loginInfo.name});
            $window.location.href = './mainScreen.html';
        });

    };
});

app.controller('listGamesCtrl', 
    [   '$scope',
        'loginTokenProvider', 
        'NgTableParams', 
        '$http',
        'dataPersistance',
        '$window',
        function($scope, loginTokenProvider, NgTableParams, $http, dataPersistance, $window) 
{
    console.log(loginTokenProvider);
    $scope.token = loginTokenProvider.getData().token;
    $scope.userLogin = loginTokenProvider.getData().login;

    var self = this;

    $http.get('http://localhost:3000/api/matches/user/' + $scope.userLogin, {
        headers: {'x-access-token' : $scope.token}
    }).success(function(data, status) 
    {
        console.log("Status is: " + status);
        if (status != 200) 
        {
            console.log("Erro: " + status + ". " + data.message);
            delete $scope.matches;
            return;
        }              

        $scope.matches = data;
    }).error(function(data, status) {
        console.log("Error. Status is: " + status);
        delete $scope.matches;
    });

    $scope.matches = [ {whitePlayerID: 'fez', blackPlayerID: 'lhcopetti', matchHashID : 'alskdfjalks'} ];

    $scope.changeChessViewTo = function(match) 
    {
        dataPersistance.setData(match);
        $window.location.href = './gamescreen.html';
    }
    //self.tableParams = new NgTableParams({}, { dataset: data});
}]);

app.controller('gameScreenCtrl', ['$scope', '$window', 'dataPersistance', 'loginTokenProvider', '$http', '$timeout', 
        function($scope, $window, dataPersistance, loginTokenProvider, $http, $timeout, _) {
    $scope.match = dataPersistance.getData();
    $scope.userLogin = loginTokenProvider.getData().login;
    $scope.token = loginTokenProvider.getData().token;

    if ($scope.match.whitePlayerID === $scope.userLogin)
        $scope.perspective = "white";
    else 
        $scope.perspective = "black";

    console.log($scope.perspective);

    $scope.getLastFENHistory = function(data) {
        var maxIndex = $window._.max(data.matchHistory, function(data) { return data.index; });
        return maxIndex.board;
    }
    $scope.reloadBoard = function(matchID) 
    {
        $http.get('http://localhost:3000/api/matches/ID/' + $scope.match.matchHashID, {
        headers: {'x-access-token' : $scope.token}
    }).success(function(data, status) 
    {
        if (status != 200) 
        {
            console.log("Erro: " + status + ". " + data.message);
            return;
        }              

        $scope.FENBoard = $scope.getLastFENHistory(data);
    });
    }

    $scope.intervalFunction = function() 
    {
        $timeout(function() {
            $scope.reloadBoard();
            $scope.intervalFunction();
        }, 3000);
    }

    $scope.reloadBoard();
    $scope.intervalFunction();

    $scope.sendCommand = function(PGNCommand) {
        var userID = $scope.userLogin;
        var matchID = $scope.match.matchHashID;

        var url = 'http://localhost:3000/api/matches/ID/' + matchID;

        $http.post(url, 
        {
            'token' : $scope.token,
            'pgnCommand' : PGNCommand
        }).success(function(data, status) {
            console.log('Data successfully transmitted!');
            console.log(data);
            $scope.FENBoard = data.result.fenBoardOutput;

        }).error(function(data, status){
            alert('Error! Check log for details');
            console.log(JSON.stringify(data) + ' ' + status);
        });
    }

    $scope.flipPerspective = function() {
        if ($scope.perspective === "white")
            $scope.perspective = "black";
        else
            $scope.perspective = "white";
    }
}]);