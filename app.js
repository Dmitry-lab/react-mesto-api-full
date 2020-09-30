const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

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
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));

app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  console.log(`Listen ${PORT}`);
});
