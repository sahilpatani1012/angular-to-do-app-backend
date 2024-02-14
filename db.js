const mongoose = require('mongoose');

const mongoURL = "mongodb+srv://sahilpatani:sahilpatani@to-do-app-angular.dapcizp.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

module.exports = mongoose;