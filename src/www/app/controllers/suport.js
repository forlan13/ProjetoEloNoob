var app = angular.module('app', []);
const clients = [''];

function sleep(m) {
    return new Promise(resolve => setTimeout(resolve, m));
  }
app.controller('suportChat', ($scope, $compile) => {
    const socket = io('http://localhost:3000/');
    
    $scope.session = () => {
        
        socket.emit('restore', { ok: true });

        socket.on('suport', (data) => {
            const { connected } = data;

            for (let c = 0; c < connected.length; c+=1) {
                const html = `
                    <div>
                        <div id="${connected[c]}">
                            <div id="messages" class="${connected[c]}"></div>
                            Menssage: <input type="text" class="message">
                            <button type="button" ng-click="chatShup('${connected[c]}')">submit</button>
                        </div>
                    </div>`;

                $('.clients').append($compile(html)($scope));
            }
        });

        socket.on('mssToS', async (data) => {
            $(`.${data.id}`).append(`<div><strong>Client</strong>: ${data.mss}</div>`);
            if (data.disconnect === true) {
                await sleep(1000);
                $(`#${data.id}`).remove();
            }
        });
        
    };

    $scope.chatShup = (client) => {
        const message = $(`#${client} input.message`).val();
        socket.emit('mss', { to: client, mss: message });
        $(`.${client}`).append(`<div><strong>Suporte</strong>: ${message}</div>`);
        
        $(`#${client} input.message`).val('');
    };

});