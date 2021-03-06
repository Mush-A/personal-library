const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: [true, "Path `title name` is required."]
  },

  comments: [String]
})

const Book = mongoose.model('book', BookSchema);

module.exports = Book;