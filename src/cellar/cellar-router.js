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
        CellarService.getUserBeers(
            req.app.get('db'),
            req.user.id
        )
            .then(response => {
                res.json(response)
            })
            .catch(next)
    })

cellarRouter
    .route('/:bid')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        let bid = req.params.bid;
        //First check if the beer already exists in the beers table of our database
        CellarService.getBeerbyId(
            req.app.get('db'),
            bid
        )
        //if it does exist, add an inventory line for the user that they have the beer
        //if it doesn't exist, first add the beer to the beers table and then add the inventory
            .then(beer => {
                if(!beer){
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
                    CellarService.getInventoryLine(
                        req.app.get('db'),
                        beer.id,
                        req.user.id
                    )
                        .then(inventoryLine => {
                            if(!inventoryLine) {
                                CellarService.addBeerForUser(
                                    req.app.get('db'),
                                    req.user.id,
                                    beer.id
                                )
                                    .then(lineAdded => res.status(201).send('Inventory added'))
                                    .catch(next)
                            } else {
                                let newInventory = inventoryLine.quantity + 1;
                                let inventory_id = inventoryLine.id;
                                CellarService.updateUserInventory(
                                    req.app.get('db'),
                                    inventory_id,
                                    newInventory
                                )
                                    .then(response => res.status(204).end())
                                    .catch(next)
                            }

                        })
                }
            })
    })

cellarRouter
    .route('/inventory')
    .patch(requireAuth, jsonBodyParser, (req, res, next) => {
        const { inventory_id, updatedQuantity } = req.body;
        const requiredFields = { inventory_id, updatedQuantity };

        if (updatedQuantity < 0) {
            return res.status(418).json({
                error: `Quantity must be greater than or equal to 0. You can't have negative beers...`
            });
        }

        for (const [key, value] of Object.entries(requiredFields)) {
            if(value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }
        }

        CellarService.updateUserInventory(
            req.app.get('db'),
            inventory_id,
            updatedQuantity
        )
            .then(response => res.status(204).end())
            .catch(next)
    })
    .delete(requireAuth, jsonBodyParser, (req, res, next) => {
        const { inventory_id } = req.body;

        CellarService.deleteInventory(
            req.app.get('db'),
            inventory_id
        )
            .then(numRowsAffected => res.status(204).end())
            .catch(next)
    })

module.exports = cellarRouter;