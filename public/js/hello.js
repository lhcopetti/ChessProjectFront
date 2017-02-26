angular.module('demo', [])
.controller('Hello', function($scope, $http) {

    var req = { 
        method: 'GET',
        url: 'http://localhost:3000/api/users',
        headers: {
            'x-access-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklEIjoiZmV6IiwiaWF0IjoxNDg3ODk0NTIzLCJleHAiOjE0ODc5ODA5MjN9.VSq99KZpUCfTPf6-2ymyemq3UTp1QrMag_WvptuMv4I'
        }
    };


    $http(req)
    .then(function(response) {
        $scope.greeting = response.data;
    });
});