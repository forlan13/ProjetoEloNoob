const app = angular.module('app', ['ngRoute']);


app.config(($routeProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: '/blog/getPosts',
      controller: 'HomeCtrl',
    })
    .when('/:date', {
      templateUrl: (params) => { return `/blog/getPosts/${params.date}`; },
      controller: 'DateCtrl',
    })
    .when('/:date/:post', {
      templateUrl: (params) => { return `/blog/getPost/${params.date}/${params.post}`; },
      controller: 'AllCtrl',
    })
    .otherwise({ redirectTo: '/' });
});

app.controller('HomeCtrl', ($rootScope, $location) => {
  $rootScope.activetab = $location.path();
});

app.controller('DateCtrl', ($rootScope, $routeParams, $location) => {
  $rootScope.activetab = $location.path() + $routeParams.date;
});

app.controller('AllCtrl', ($rootScope, $routeParams, $location) => {
  $rootScope.activetab = $location.path() + $routeParams.date + $routeParams.post;
});


app.controller('post', ($scope, $http) => {
  $scope.addPost = () => {
    const { title, mss } = $scope;
    $http.post('/blog/addPost', JSON.parse(`{ "title": "${title}", "body": "${mss}" }`))
      .success(() => {
        $router.reload();
      })
      .error((response) => {
        console.log(response);
      });
  };

  $scope.removePost = () => {
    const { post } = $scope;
    $http.delete(`/blog/removePost/${post}`)
      .success(() => {
        $router.reload();
      })
      .error((response) => {
        console.log(response);
      });
  };

  $scope.getPostPath = () => {
    $http.get('/blog/getPostPath')
      .success((response) => {
        const { path } = response;
        $scope.path = path;
      }).error((response) => {
        console.log(response);
      });
  };
});
