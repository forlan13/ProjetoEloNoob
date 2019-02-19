const app = angular.module('app', []);

app.controller('check', ($scope, $window) => {
  $scope.check = () => {
    if ((document.cookie).split('=', 2)[1]) {
      $window.location.href = '/';
    }
  };
});

app.controller('register', ($scope, $http) => {
  $scope.submit = () => {
    const { name, password, email } = $scope;
    const data = JSON.parse(`{ "name": "${name}", "email": "${email}", "password": "${password}"}`);

    if (name === 'undefined' || !email || !password) {
      console.log('a');
    } else if (password.length < 8) {
      document.getElementById('senha-invalida').innerHTML = 'senha invalida, a senha deve conter no mínimo 8 dígitos';
    } else {
      $http.post('/auth/register', data)
        .success((response) => {
          alert('Registrado com sucesso, verifique sua conta');
          console.log(response);
        })
        .error((response) => {
          alert(response.error);
        });
    }
  };
});

app.controller('login', ($scope, $http, $window) => {
  $scope.submit = () => {
    const { name, password } = $scope;
    const data = JSON.parse(`{ "name": "${name}", "password": "${password}"}`);

    if (name === 'undefined' || !password) {
      console.log('a');
    } else {
      $http.post('/auth/authenticate', data)
        .success((response) => {
          const { user, token } = response;

          if (user.verified === false) {
            console.log('Email não verificado, porfavor verifique');
            return 0;
          }
          console.log('sou um easterEgg, oi :)');
          alert('Logado com sucesso\nRedirecionando...');
          $window.localStorage.clear();
          $window.localStorage.setItem('user', JSON.stringify(user));
          const date = new Date();
          date.setTime(date.getTime() + 1);
          document.cookie = `token=${token}; path=/`;

          $window.location.href = '/';
          return 0;
        })
        .error((response) => {
          console.log(response.error);
        });
    }
  };
});
