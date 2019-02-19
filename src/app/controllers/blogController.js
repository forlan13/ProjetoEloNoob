const express = require('express');

const app = express();
const fs = require('file-system');
const ejs = require('ejs');
const path = require('path');

const router = express.Router();

app.set('view engine', 'ejs');

// --------------------Pega as noticas mais recentes e põe na tela--------------
router.get('/getPosts', (req, res) => {
  const d = new Date();
  const date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;

  // função para checkar as noticias mais recentes
  function recent(data, da) {
    fs.readdir(path.resolve(`news/${data}`), (err, items) => {
      let html = '';
      let i = 1;
      if (err || items === undefined) {
        const ontem = new Date(da.getTime());
        ontem.setDate(da.getDate() - i);
        i += 1;
        recent(`${ontem.getMonth()}-${ontem.getDate()}-${ontem.getFullYear()}`, ontem);
      } else {
        for (let c = 0; c < items.length; c += 1) {
          fs.readFile(path.resolve(`news/${data}/${items[c]}`), (err, dados) => {
            html += dados.toString();
            if (c === (items.length - 1)) {
              res.render('index', { body: html });
            }
          });
        }
      }
    });
  }

  recent(date, d);
});
// -----------------------------------------------------------------------------

// ----------------------Pega noticias de um dia expecifico-------------------
router.get('/getPosts/:date', (req, res) => {
  const { date } = req.params;

  fs.readdir(path.resolve(`news/${date}`), (err, items) => {
    let html = '';
    for (let c = 0; c < items.length; c += 1) {
      fs.readFile(path.resolve(`news/${date}/${items[c]}`), (err, dados) => {
        html += dados.toString();
        if (c === (items.length - 1)) {
          res.render('index', { body: html });
        }
      });
    }
  });
});
// -------------------------------------------------------------------------

// -----------------------Pega uma noticia especifica---------------------
router.get('/getPost/:date/:postName', (req, res) => {
  const { date, postName } = req.params;
  res.sendFile(path.resolve(`news/${date}/${postName}.html`), {
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  }, (err) => {
    if (err) {
      throw err;
    }
  });
});
// ----------------------------------------------------------------------

// -----------------Adiciona um post com base no que vc digitou no HTML------------
router.post('/addPost', (req) => {
  const { title, body } = req.body;

  const d = new Date();
  const date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;

  // Vai conferir se já existe uma pasta da data atual
  fs.stat(path.resolve(`news/${date}`), (erro) => {
    if (erro) {
      // Caso não existe, irar criar uma
      fs.mkdirSync(path.resolve(`news/${date}`));
      // Nomeando o arquivo
      let archiName = title.toLowerCase();
      while (archiName.indexOf(' ') !== -1) {
        archiName = archiName.replace(' ', '-');
      }

      // ---------------------Escrevendo um arquivo dentro da pasta------------------
      ejs.renderFile(path.resolve('resources/templates/template.ejs'), { date, archiName, title, body }, (err, html) => {
        if (err) {
          console.log(err);
        }
        fs.writeFile(path.resolve(`news/${date}/${archiName}.html`), html, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
      // ----------------------------------------------------------------------------
    } else {
      // ---------------Caso exista só vai criar um novo arquivo dentro-------------
      let archiName = title.toLowerCase();
      while (archiName.indexOf(' ') !== -1) {
        archiName = archiName.replace(' ', '-');
      }

      ejs.renderFile('resources/templates/template.ejs', { date, archiName, title, body }, (err, html) => {
        if (err) {
          console.log(err);
        }
        fs.writeFile(path.resolve(`news/${date}/${archiName}.html`), html, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
      // --------------------------------------------------------------------------
    }
  });
});
// ---------------------------------------------------------------------------------

// -------------------------Usado para remover o post---------------------
router.delete('/removePost/:date/:postName', (req) => {
  const { date, postName } = req.params;
  fs.unlink(path.resolve(`news/${date}/${postName}.html`), (err) => {
    if (err) {
      console.log(err);
    }
  });
});
// --------------------------------------------------------------------

// Pega o caminho aonde está o post, para mostrar as datas onde tem post criado
router.get('/getPostPath', (req, res) => {
  fs.readdir(path.resolve('news'), (err, items) =>{
    if (err) {
      return res.send({ error: 'Error Post Path' });
    }

    return res.send({ path: items.reverse() });
  });
});
// ----------------------------------------------------------------------------

module.exports = app => app.use('/blog', router);
