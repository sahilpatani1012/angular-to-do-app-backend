const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  id: {type:String, required: true},
  completed: { type: Boolean, default: false },
  deadline: {type: Date}
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
