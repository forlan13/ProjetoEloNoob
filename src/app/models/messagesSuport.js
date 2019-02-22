const mongoose = require('../../database');

// Criação do Schema de Menssagens
const messageSchema = new mongoose.Schema({
  idClient: {
    type: String,
    require: true,
  },

  messages: [{
      name: String,
      message: String,
    }],
});

// Exportação do Schema do Usuario
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
