const app = angular.module('app', []);

app.controller('verify', ($scope, $http, $window, $location) => {
  $scope.verified = () => {
    const data = $location.search();
    const json = JSON.parse(`{ "email": "${data.email}","token": "${data.token}"}`);

    $http.post('/auth/register_verify', json)
      .success((response) => {
        console.log(response);
        $window.location.href = '/';
      }).error((response) => {
        console.log(response);
      });
  };
});
