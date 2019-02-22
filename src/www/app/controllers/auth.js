const app = angular.module('app', []);


const socket = io.connect('http://localhost:3000/');
let chatId;

// ---------------Para validar uma sessão--------------------
app.controller('auth', ($scope, $http, $window) => {
  
  $scope.session = () => {

    // --------------------------Chat de Suporte----------------------------
    socket.on('conn', (data) => {
      socket.emit('success', data);
      chatId = data;
    });

    socket.on('greeting', (data) => {
      $('#messages').append(`<div><strong>Suporte</strong>: ${data}</div>`);
    });

    socket.on('mess', (data) => {
      const audio = document.getElementById('audio');
      audio.play();

      $("#messages").stop().animate({ scrollTop: $("#messages")[0].scrollHeight}, 1000);

      $('#messages').append(`<div><strong>Suporte</strong>: ${data}</div>`);
    });
    // ----------------------------------------------------------------------
    // --------------------------Verificação do Token--------------------------
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
    // -------------------------------------------------------------------------
  };
// --------------------------------------------------------------------------
  // -------------------------Logout---------------------------------------
  $scope.logout = () => {
    $window.localStorage.clear();
    document.cookie = 'token=;path=/';
    $window.location.href = '/';
  };
});
// --------------------------------------------------------------------------
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

// ----------------------------Envio de menssagens------------------------------------
app.controller('Chat', ($scope, $window) => {
    
    $scope.chat = () => {
      const user = JSON.parse($window.localStorage.getItem('user'));
      if ($scope.message){ 
        socket.emit('mssToS', { user: user === null ? 'Client' : user.name , id: chatId, mss: $scope.message });  
        $("#messages").stop().animate({ scrollTop: $("#messages")[0].scrollHeight}, 1000);
        $('#messages').append(`<div><strong>Eu</strong>: ${$scope.message}</div>`);
        $scope.message = null;
      } 
    }
});

// --------------------------------------------------------------------------------