const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/clients', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;

// Esse Script é para se conectar ao banco
