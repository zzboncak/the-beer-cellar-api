const express = require('express');
const CellarService = require('./cellar-service');
const { requireAuth } = require('../middleware/jwt-auth');

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

module.exports = cellarRouter;