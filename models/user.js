const mongoose = require('mongoose');
const Todo = require('./todo')

const userSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userPassword:  { type: String, required: true },
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
