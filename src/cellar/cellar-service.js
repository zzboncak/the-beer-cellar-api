const CellarService = {
    getUserBeers(knex, user_id) {
        return knex
            .select('beer_name', 'quantity', 'beer_description', 'untappd_rating')
            .from('inventory')
            .join('beers', 'beers.id', '=', 'inventory.beer_id')
            .join('users', 'users.id', '=', 'inventory.user_id')
            .where({ user_id })
    },
    addBeerToBeerTable(knex, newBeer) {
        return knex
            .into('beers')
            .insert(newBeer)
            .returning('*')
            .then(([beer]) => beer)
    },
    getBeerbyId(knex, untappd_beer_id) {
        return knex
            .select('*')
            .from('beers')
            .where({untappd_beer_id})
            .first()
    },
    addBeerForUser(knex, user_id, beer_id, quantity=1, tradable=false) {
        let inventoryLine = {
            user_id,
            beer_id,
            quantity
        }
        return knex
            .into('inventory')
            .insert(inventoryLine)
            .returning('*')
            .then(([line]) => line)
    }
}

module.exports = CellarService;