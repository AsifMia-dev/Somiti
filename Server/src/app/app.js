const express = require('express');
const dotenv = require('dotenv');

const middleware = require('./middleware')
const { notFound, errorHandler } = require('./error');
const routes = require('./route');

dotenv.config();

const app = express();

app.use(middleware);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
