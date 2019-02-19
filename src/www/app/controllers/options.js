var app = angular.module('app', []);


app.controller('options', function($scope, $http, $window){
    $scope.session = function() {
        token = (document.cookie).split('=', 2)[1];
        if(!token){
            window.localStorage.clear();
            $window.location.href = '/';
        }

        $http.get("/valid", {
            headers:{'Authorization': 'Bearer '+token+''}
        })
        .success(function(response) {
            user = JSON.parse($window.localStorage.getItem('user'));
            $window.localStorage.setItem('validSession', JSON.stringify(response.ok));
            $scope.name = user.name;

        })
        .error(function(response){
            window.localStorage.clear();
            $window.location.href = '/';
        });

    };

    $scope.submit = () => {

        token = (document.cookie).split('=', 2)[1];
        let { name, password, Newpassword, RNewpassword } = $scope;
    
        if ((password !== undefined) && (password !== '')) {
            if ((Newpassword === undefined || Newpassword === '') || (RNewpassword === undefined || RNewpassword === '')) {
                alert('há campos vazios');
                return 0;
            }
            if(!(Newpassword == RNewpassword)){
                alert('As novas senhas não batem');
                return 0;
            }
            
        } else {
            // Caso os campos de senha estejam vazios, só atualize o Nome
            password = (password === undefined || password === '') ? 'null' : password;
            Newpassword = (Newpassword === undefined || password === '') ? 'null' : password; 
            RNewpassword = (RNewpassword === undefined || password === '') ? 'null' : password; 
        
        }

        
        const data = JSON.parse(`{ "name": "${name}", "password": "${password}", "npassword": "${Newpassword}" }`);
        console.log(data);
        
        $http.put('/options/modify', data, {
            headers:{'Authorization': 'Bearer '+token+''},
        }).success((response) => {
            $window.localStorage.clear();
            $window.localStorage.setItem('user', JSON.stringify(response.user));
            document.cookie = `token=${response.token}; path=/`;
            $window.location.href = "/";

        }).error((response) => {
            alert(response);
        });





    };
});
