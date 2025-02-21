const mongoose = require('mongoose');
const app = require('./app');

const { DB_URI,PORT } = process.env;

mongoose.set('strictQuery', true);

const run = async () => {
  try {
    await mongoose.connect(DB_URI);
    app.listen(PORT);
    console.log('Database connection successful');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

run();
