const express = require('express');

const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const port = normalizePort(process.env.PORT || '3000');

const server = app.listen(port);
const io = require('socket.io').listen(server);

const Message = require('./app/models/messagesSuport.js');


// --------------------Rederização da pagina-------//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/index.html'));
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/www')));
// -----------------------------------------------//

// -------------------Chat de Suport ---------------//

const clients = [];

io.on('connection', async(socket) => {
  
  
  // -----------------Passando a Connecção para o Suporte-----------
  socket.emit('conn', socket.id);
  socket.on('success', async (data) => {
    clients.push(data);
    socket.broadcast.emit('suport', { connected: clients });
    
    await Message.create({ idClient: data }); // Criação do Chat no banco, para evitar perdas de menssagens

  });
  // ----------------------------------------------------------------
  socket.emit('greeting', 'Welcome to EloUp'); // Menssagem de Bem Vindo

  // Menssagem do Suporte para o cliente
  socket.on('mss', async (data) => {
    socket.to(data.to).emit('mess', data.mss);
    
    // Inserção das menssagens do suporte
    await Message.findOneAndUpdate({ idClient: data.to }, {
      $push: {
        messages: { name: 'Suport', message: data.mss },
      },
    });

  });

  // Menssagem do Cliente para o suporte
  socket.on('mssToS', async (data) => {
    socket.broadcast.emit('mssToS',data);

    // Inserção das menssagens do Cliente
    await Message.findOneAndUpdate({ idClient: data.id }, {
      $push: {
        messages: { name: 'Client', message: data.mss },
      },
    });

  });

  await Message.find({}, (err, docs) => {
    if (!err) {
      socket.emit('restore', docs);
    } else {
      socket.emit('restore', 'nothing to see here');
    } 
  });

  // Passando a Desconnecção para o Suporte
  socket.on('disconnect', async () => {
    clients.splice(clients.indexOf(socket.id, 1));

    socket.broadcast.emit('mssToS', { id: socket.id, mss: "Client Disconnected", disconnect: true });

    await Message.findOneAndRemove({ idClient: socket.id });
    if (!clients.length) {
      return 0;
    } else {
      socket.broadcast.emit('suport', clients);
    }
  });
  
});

// -----------------------------------------------//

require('./app/controllers/index.js')(app);

// --------------------------Apagar diariamente contas não verificadas------------------
function sleep(h) {
  return new Promise(resolve => setTimeout(resolve, h * 3600000));
}

async function demo() {
  await sleep(24);

  const users = await User.find({ verified: false })
    .select('+passwordResetExpires verified');
  const now = new Date();
  if (!users) {
    demo();
  }
  for (let c = 0; c < users.length; c += 1) {
    if (now > users[c].passwordResetExpires) {
      await User.findByIdAndRemove(users[c]._id);
    }
  }
  demo();
}

demo();
// ------------------------------7----------------------------------------------------

// function para encontrar porta disponível
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
