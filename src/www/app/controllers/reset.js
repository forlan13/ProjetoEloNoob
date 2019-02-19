var app = angular.module('app', []); 


app.controller('reset', function ($scope, $http, $location) {
    $scope.reset = function() {
        data = $location.search();
        return data;
    };
 
    $scope.submit = function(data) {
        password = $scope.password;

        if(password == undefined){
            console.log("Há campos vazios");
            return 0;
        }

        json = JSON.parse('{ "email": "'+data.email+'","token": "'+data.token+'","password": "'+password+'" }');
        
        $http.post('/auth/reset_password', json)
        .success(function(response) {
            console.log(response);
        })
        .error(function(response){
            console.log(response);
        });

    }

 });

app.controller('forgot', function($scope, $http) {
    $scope.forgot = function() {
        email = JSON.parse('{ "email": "'+$scope.email+'"}');
        
        $http.post('/auth/forgot_password', email)
        .success(function(response) {
            console.log(response);
        })
        .error(function(response) {
            console.log(response);
        })


    }
})
 
 
 