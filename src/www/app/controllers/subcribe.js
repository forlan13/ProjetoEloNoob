const app = angular.module('app', []);

app.controller('subcribe', ($scope, $http, $window) => {
  const token = (document.cookie).split('=', 2)[1];
  const openSub =  $window.localStorage.getItem('openSub');

  // Validação de sessão como adm
  $scope.sessionAdm = () => {
    if (!token) {
      document.cookie = 'token=;path=/';
      $window.localStorage.clear();
      $window.location.href = '/';
    }

    const user = JSON.parse($window.localStorage.getItem('user'));

    $http.post('/valid/adm', user, {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      $window.localStorage.setItem('validSession', JSON.stringify(response.ok));
    }).error(() => {
      $window.location.href = '/';
    });
  };
  // Validação de sessão
  $scope.session = () => {
    if (!token) {
      $window.localStorage.clear();
      $window.location.href = '/';
    }

    if (openSub === 'false' || openSub === '') {
      $window.localStorage.setItem('openSub', false);
      $window.location.href = '/';
    }

    const socket = io.connect('http://localhost:3000/');
    socket.on('openF', (data) => {
      const date = Date.now();
      if (date >= Date.parse(data.from) && date <= Date.parse(data.until)) {
        $window.localStorage.setItem('openSub', true);
      } else {
        $window.localStorage.setItem('openSub', false);
        $window.location.href = '/';
      }
    });

    $http.get('/valid', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      $window.localStorage.setItem('validSession', JSON.stringify(response.ok));
    }).error(() => {
      $window.localStorage.clear();
      $window.location.href = '/';
    });
  };
  // Criação da ficha de inscrição

  $scope.submit = () => {
    const { name, age, cpf } = $scope;
    const data = JSON.parse(`{ "name": "${name}", "age": ${age}, "cpf": ${cpf} }`);

    $http.post('/subcribe/create', data, {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      console.log(response);
    }).error((response) => {
      console.log(response.error);
    });
  };
  // Mostrar ficha de inscrição

  $scope.showSub = () => {
    $http.get('/subcribe/find', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      const { name, age, cpf } = response.subcribe;
      $scope.nome = name;
      $scope.idade = age;
      $scope.CPF = cpf;
    }).error((response) => {
      console.log(response.error);
    });
  };
  // Apagar inscrição

  $scope.delete = () => {
    const { _id } = JSON.parse($window.localStorage.getItem('user'));

    $http.delete(`/subcribe/${_id}`, {
      params: { subId: _id },
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      console.log(response);
    }).error((response) => {
      console.log(response.error);
    });
  };

  // ----------------------------ADM APENAS --------------------------

  // Mostrar todas as fichas de inscrições
  $scope.showAllSub = () => {
    const { nome, cpf } = $scope;

    // Caso não tenha nos campos de Busca, ele pega todas as fichas
    if (nome === '' && cpf === undefined) {
      $http.get('/subcribe/findAll', {
        headers: { Authorization: `Bearer ${token}` },
      }).success((response) => {
        const { subcribe } = response;
        $scope.subcribe = subcribe;
      }).error((response) => {
        console.log(response.error);
      });
      // Pega fichas específicas
    } else {
      const data = JSON.parse(`{ "nome": "${nome}", "CPF": ${cpf !== undefined ? cpf : 0} }`);
      $http.put('/subcribe/find_subscription', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .success((response) => {
          const { subcribe } = response;
          $scope.subcribe = subcribe;
        }).error((response) => {
          console.log(response);
        });
    }
  };

  $scope.openSub = () => {
    const { from, until } = $scope;
    const data = JSON.parse(`{ "from": "${from}", "until": "${until}" }`);
    const socket = io.connect('http://localhost:3000/');
    socket.emit('open', data);
  };
});
