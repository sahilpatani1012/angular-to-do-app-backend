require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const mongoose = require('./db');
const User = require("./models/user");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:4200",
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, //(7 days)
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Restrict access to the session cookie
    sameSite: 'strict', // Mitigate cross-site request forgery (CSRF) attacks
  }
}));

app.get('/api/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params
    const user = await User.findOne({ userEmail })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const todos = user.todos;
    res.json(todos);
  }
  catch (error) {
    console.log(error.message);
  }
})

app.patch('/api/:userEmail/add-todos', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const { title, id, completed, deadline } = req.body;

    const user = await User.findOne({ userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTodo = {
      title,
      id,
      completed,
      deadline
    };

    user.todos.push(newTodo);

    await user.save();

    res.status(200).json({ message: 'Todo item added successfully', user });
  } catch (error) {
    console.error('Error adding todo item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/api/update-list/:userEmail/:id', async (req, res) => {
  try {
    const { userEmail, id } = req.params;
    const user = await User.findOne({ userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let todoItem = user.todos.filter((todo) => todo.id === id)[0]
    todoItem.completed = true;
    await user.save();
    res.status(200).json({ message: 'Todo item updated successfully', user });
  }
  catch (error) {
    console.error('Error adding todo item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/api/signup', async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    if (!userEmail || !userPassword) {
      return res.status(400).send({ message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(409).send({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = new User({
      userEmail,
      userPassword: hashedPassword,
      todos: []
    });
    await newUser.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(userPassword, user.userPassword);
    if (!validPassword) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userEmail: user.userEmail }, process.env.JWT_SECRET || 'jwtsecretkey', { expiresIn: '1h' });
    req.session.token = token;
    res.status(200).send({ message: 'Login successful', userEmail });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error logging in' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
