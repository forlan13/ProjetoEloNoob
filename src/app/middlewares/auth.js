const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se algum token foi enviado
  if (!authHeader) {
    return res.status(401).send({ error: 'Sem token enviado' });
  }

  const parts = authHeader.split(' ');

  // Verifica o token está escrito corretamente
  if (!parts.lenght === 2) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' });
  }
  // -------------------------------------------

  // Verifica se token está valido
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Token Invalido' });
    }

    req.userId = decoded.id;
    return next();
  });
  return 0;
};
