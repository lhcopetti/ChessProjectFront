var app = angular.module('chessProjectApp', ["ngTable"]);


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
        function($scope, loginTokenProvider, NgTableParams, $http) 
{
    console.log(loginTokenProvider);
    $scope.token = loginTokenProvider.getData().token;
    $scope.userLogin = loginTokenProvider.getData().login;

    var self = this;



    $http.get('http://localhost:3000/api/matches/user/' + $scope.userLogin, {
        headers: {'x-access-token' : $scope.token}
    }).success(function(data, status) 
    {
        if (status != 200) 
        {
            console.log("Erro: " + status + ". " + data.message);
            return;
        }              

        $scope.matches = data;
    });

    $scope.matches = [ {whitePlayerID: 'fez', blackPlayerID: 'lhcopetti', matchHashID : 'alskdfjalks'} ];
    //self.tableParams = new NgTableParams({}, { dataset: data});
}]);