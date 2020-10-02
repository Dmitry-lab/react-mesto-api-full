const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { request } = require('express');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

/* mongoose.connect('mongodb+srv://<>:<>@cluster0.cfv4y.gcp.mongodb.net/mydb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}); */

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// app.use((req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));
app.use(errorLogger);
app.use((req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  const errorJSON = statusCode === 500 ? { message: 'Ошибка сервера' } : { message };
  res.status(statusCode).send(errorJSON);
});

app.listen(PORT, () => {
  console.log(`Listen ${PORT}`);
});
