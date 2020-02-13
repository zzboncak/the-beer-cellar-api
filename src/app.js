require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ID, CLIENT_SECRET } = require('./config');
const request = require('request');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

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

app.get('/api/add/:bid', (req, res, next) => {
  let bid = req.params.bid;
  let untappdUrl = `https://api.untappd.com/v4/beer/info/${bid}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&oauth_consumer_key=${CLIENT_ID}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1581543417&oauth_nonce=o4uUA6ovQTM&oauth_version=1.0&oauth_signature=+cNoi9pGpQCFryVCOHqge5KoH6o=`;
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
