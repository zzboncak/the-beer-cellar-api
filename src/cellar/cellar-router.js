const express = require('express');
const CellarService = require('./cellar-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { CLIENT_ID, CLIENT_SECRET } = require('../config');
const request = require('request');

const cellarRouter = express.Router();
const jsonBodyParser = express.json()


cellarRouter
    .route('/')
    .get(requireAuth, jsonBodyParser, (req, res, next) => {
        console.log(req.user);
        CellarService.getUserBeers(
            req.app.get('db'),
            req.user.id
        )
            .then(response => {
                console.log(response)
                res.json(response)
            })
            .catch(next)
    })

cellarRouter
    .route('/add/:bid')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        let bid = req.params.bid;
        //need a service object to check if a beer with this beer id is in the database already
        //if so, just add the inventory line. If not, request the data from Untappd.
        CellarService.getBeerbyId(
            req.app.get('db'),
            bid
        )
            .then(beer => {
                if(!beer){
                    console.log('no beer!')
                    let untappdUrl = `https://api.untappd.com/v4/beer/info/${bid}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&oauth_consumer_key=${CLIENT_ID}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1581543417&oauth_nonce=o4uUA6ovQTM&oauth_version=1.0&oauth_signature=+cNoi9pGpQCFryVCOHqge5KoH6o=`;
                    let options = {
                        'method': 'GET',
                        'headers': {
                            'content-type': 'application/json'
                        },
                        'url': untappdUrl
                    }
                    request(options, function (error, untappdResponse) { 
                        if (error) throw new Error(error);
                        let untappdJson = JSON.parse(untappdResponse.body);
                        let untappdBeer = untappdJson.response.beer;
                        let newBeer = {
                            untappd_beer_id: untappdBeer.bid,
                            beer_name: untappdBeer.beer_name,
                            untappd_rating: untappdBeer.rating_score,
                            beer_description: untappdBeer.beer_description,
                            brewery_id: untappdBeer.brewery.brewery_id,
                            brewery_name: untappdBeer.brewery.brewery_name,
                            beer_image: untappdBeer.beer_label,
                            beer_style: untappdBeer.beer_style
                        }
                        //need service object to insert beer into the beers table
                        CellarService.addBeerToBeerTable(
                            req.app.get('db'),
                            newBeer
                        )
                            .then(addedBeer => {
                                CellarService.addBeerForUser(
                                    req.app.get('db'),
                                    req.user.id,
                                    addedBeer.id,
                                )
                                    .then(lineAdded => res.status(201).send('Inventory added'))
                                    .catch(next)
                            })
                    })
                } else {
                    CellarService.addBeerForUser(
                        req.app.get('db'),
                        req.user.id,
                        beer.id
                    )
                        .then(lineAdded => res.status(201).send('Inventory added'))
                        .catch(next)
                    //res.send(beer)
                }
            })
    })

module.exports = cellarRouter;