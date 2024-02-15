const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userPassword: { type: String, required: true },
  todos: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deadline: { type: Date }
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
