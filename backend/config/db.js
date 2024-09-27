const mongoose = require('mongoose');


async function connect() {
  await mongoose.connect('mongodb+srv://omdey3424:D8lTHGbvQVD4PK9t@cluster0.e1klmdc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  console.log('Connected to the database');
}

module.exports = connect;