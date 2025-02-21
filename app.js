const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const { PUBLIC } = require('./constants/path');

const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/auth');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static(PUBLIC));

app.use('/api/contacts', contactsRouter);
app.use('/users', authRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Path not found' });
});

app.use((err, _, res, __) => {
  const { statusCode = 500, message = 'Internal server error' } = err;
  res.status(statusCode).json({ message });
});

module.exports = app;
