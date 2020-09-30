const jwt = require('jsonwebtoken');
const SECRET_KEY = '479f6120aa76a2ac2211367c8a3a88de940057af25eeacb789502425c98a9800';

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (authorization) => {
  return authorization.replace('Bearer ', '');
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  };

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch {
    return handleAuthError(res);
  }

  req.user = payload;
  next();
}
