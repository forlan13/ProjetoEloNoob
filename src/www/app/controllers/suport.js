const app = angular.module('app', []);


function sleep(m) {
    return new Promise(resolve => setTimeout(resolve, m));
}

// ---------------Função de renderizar os Chats dos clients----------
function renderChats(id, $compile, $scope){
    const html = `
        <div>
            <div id="${id}">
                <div id="messages" class="${id}"></div>
                Menssage: <input type="text" class="message">
                <button type="button" ng-click="chatShup('${id}')">submit</button>
            </div>
        </div>`;

    $('.clients').append($compile(html)($scope));
}
// -----------------------------------------------------------------

app.controller('suportChat', ($scope, $compile) => {
    const socket = io('http://localhost:3000/'); // Connecção com o socket
    
    $scope.session = () => {

        // ------------------Recuperação dos Chats Ativos---------------------
        socket.on('conn', (data) => {
            socket.on('restore', (data) => {
                for (let c = 0; c < data.length; c+=1) {
                    renderChats(data[c].idClient, $compile, $scope); // Chamada da função de renderizar
        
                    const client = data[c];
                    const messages = data[c].messages;
                    for (let i = 0; i < messages.length; i += 1) {
                        $(`.${client.idClient}`).append(`<div><strong>${messages[i].name}</strong>: ${messages[i].message}</div>`);  
                    }

                }
            });
          });
        
        // -----------------------------------------------------------------------
        
        // --------------------Adição de um novo chat-------------------------
        socket.on('suport', (data) => {
            const { connected } = data;
            for (let c = 0; c < connected.length; c+=1) {
                renderChats(connected[c], $compile, $scope);
            }
        });
        // ------------------------------------------------------------------

        // -----------------------Recebimento de Menssagens---------------------
        socket.on('mssToS', async (data) => {

            // -------------------Som de Menssagem recebida-------------------
            const audio = document.getElementById('audio');
            audio.play();
            // ---------------------------------------------------------------

            // Sempre manter o chat scrollando
            $(`.${data.id}`).stop().animate({ scrollTop: $(`.${data.id}`)[0].scrollHeight}, 1000); 

            // ---------------------------Checkar se há algo no campo menssage-------------------------
            if (data.user) {
                $(`.${data.id}`).append(`<div><strong>${data.user}</strong>: ${data.mss}</div>`);  
            } else {
                $(`.${data.id}`).append(`<div><strong>Client</strong>: ${data.mss}</div>`);
            }
            // --------------------------------------------------------------------------------------
            
            // ---------------------Remover Chats desconnectados----------------------------------
            if (data.disconnect === true) {
                await sleep(1000);
                $(`#${data.id}`).remove();
            }
            // -----------------------------------------------------------------------------------
        });
        // ----------------------------------------------------------------------
    };

    // -----------------------------------Envio de menssagens------------------------------
    $scope.chatShup = (client) => {
        const message = $(`#${client} input.message`).val();
        if(message){
            socket.emit('mss', { to: client, mss: message });

            $(`.${client}`).stop().animate({ scrollTop: $(`.${client}`)[0].scrollHeight}, 1000);

            $(`.${client}`).append(`<div><strong>Suporte</strong>: ${message}</div>`);
            
            $(`#${client} input.message`).val('');
        }
        
    };
    // --------------------------------------------------------------------------------
});