const jwt = require('jsonwebtoken');
const SECRET_KEY = '479f6120aa76a2ac2211367c8a3a88de940057af25eeacb789502425c98a9800';
const AuthorizationError = require('../errors/authorization-error');

const extractBearerToken = (authorization) => {
  return authorization.replace('Bearer ', '');
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация'));
  };

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;
  next();
}
