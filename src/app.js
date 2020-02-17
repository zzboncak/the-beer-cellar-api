require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ID, CLIENT_SECRET, CLIENT_ORIGIN } = require('./config');
const request = require('request');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const cellarRouter = require('./cellar/cellar-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));

//CLIENT_ORIGIN is an array of allowed origins. This logic allows those domains through, and blocks the others
let corsOptions = {
  origin: function (origin, callback) {
    if (CLIENT_ORIGIN.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));

app.use(helmet());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/cellar', cellarRouter);

app.get('/api/search/:beer_name', (req, res, next) => {
  let beer_name = req.params.beer_name;
  let untappdUrl = `https://api.untappd.com/v4/search/beer?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&q=${beer_name}`;
  let options = {
    'method': 'GET',
    'url': untappdUrl
  }
  request(options, function (error, response) { 
    if (error) throw new Error(error);
    res.send(response.body);
  });
})

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
})

module.exports = app;
