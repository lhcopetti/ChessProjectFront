var app = angular.module('chessProjectApp', []);


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
            loginTokenProvider.setData({token: data.token});
            $window.location.href = './mainScreen.html';
        });

    };
});

app.controller('listGamesCtrl', function($scope, loginTokenProvider) 
{
    $scope.token = loginTokenProvider.getData().token;
});