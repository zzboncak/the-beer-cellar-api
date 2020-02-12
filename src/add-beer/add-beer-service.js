const addBeerService = {
    addBeer(knex, user, beerInfo) {
        return knex
            .into('inventory')
    }
}