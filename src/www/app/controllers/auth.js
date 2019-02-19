const app = angular.module('app', []);

// Para validar uma sessão
app.controller('auth', ($scope, $http, $window) => {
  $scope.session = () => {
    const openSub = $window.localStorage.getItem('openSub');

    if (!openSub) {
      $window.localStorage.setItem('openSub', false);
    }

    const socket = io.connect('http://localhost:3000/');
    socket.on('openF', (data) => {
      const date = Date.now();
      if (date >= Date.parse(data.from) && date <= Date.parse(data.until)) {
        $window.localStorage.setItem('openSub', true);
      }
    });

    const token = (document.cookie).split('=', 2)[1];
    if (!token) { // caso não exista token, desvalida a sessão
      console.log('no session');
      document.cookie = 'token=; path=/';
      $window.localStorage.clear();
      return;
    }
    $http.get('/valid', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => { // se tiver tudo certo, valida uma sessao
      const { _id, name } = JSON.parse($window.localStorage.getItem('user'));
      if (response.user === _id) {
        document.getElementById('a').innerHTML = name;
        $window.localStorage.setItem('validSession', JSON.stringify(response.ok));// criar uma chave afirmando a validade da sessao
      }
    }).error((response) => {
      console.log(response);
      document.cookie = 'token=; path=/';
      $window.localStorage.clear();
    });
  };

  $scope.logout = () => {
    $window.localStorage.clear();
    document.cookie = 'token=;path=/';
    $window.location.href = '/';
  };
});
// ativa / desativa itens na tela, dependendo da sessão
app.controller('session', ($scope, $window) => {
  $scope.validClass = () => {
    const valid = $window.localStorage.getItem('validSession');
    if (valid === 'true') {
      return 'nav-link d-none d-lg-block';
    }
    return 'nav-link disabled d-md-none';
  };

  $scope.validDrop = () => {
    const valid = $window.localStorage.getItem('validSession');
    if (valid === 'true') {
      return 'btn btn-success dropdown-toggle';
    }
    return 'btn disabled btn-success dropdown-toggle';
  };
});
