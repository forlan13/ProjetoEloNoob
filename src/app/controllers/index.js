const fs = require('fs');
const path = require('path');

module.exports =  app => {
  fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== 'index.js')))
    .forEach(file => require(path.resolve(__dirname, file))(app));
};

/* Esse Script faz todos os controllers dessa pasta irem automaticamente para INDEX.js
 * Caso você esteja usando o eslint, ignora os erros, eles são necessarios
 *
*/
