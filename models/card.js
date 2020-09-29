const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    minlenght: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    match: new RegExp('https?:\\/\\/(?:www\\.|(?!www))[a-z0-9][a-z0-9-]+[a-z0-9]\\.[^\\s]{2,}|www\\.[a-z0-9][a-z0-9-]+[a-z0-9]\\.[^\\s]{2,}'
      + '|https?:\\/\\/(?:www\\.|(?!www))[a-z0-9]+\\.[^\\s]{2,}|www\\.[a-z]+\\.[^\\s]{2,}', 'gi'),
    required: true,
  },
  owner: mongoose.Schema.Types.ObjectId,
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
