const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    match: new RegExp('https?:\\/\\/(?:www\\.|(?!www))[a-z0-9][a-z0-9-]+[a-z0-9]\\.[^\\s]{2,}|www\\.[a-z0-9][a-z0-9-]+[a-z0-9]\\.[^\\s]{2,}'
      + '|https?:\\/\\/(?:www\\.|(?!www))[a-z0-9]+\\.[^\\s]{2,}|www\\.[a-z]+\\.[^\\s]{2,}', 'gi'),
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты.',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

userSchema.statics.findUserByCreditians = function findUserByCreditians(email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильное имя пользователя или пароль.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильное имя пользователя или пароль.'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
