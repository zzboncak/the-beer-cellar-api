const CellarService = {
    getUserBeers(knex, user_id) {
        return knex
            .select('beer_name', 'quantity', 'beer_description', 'untappd_rating')
            .from('inventory')
            .join('beers', 'beers.id', '=', 'inventory.beer_id')
            .join('users', 'users.id', '=', 'inventory.user_id')
            .where({ user_id })
    }
}

module.exports = CellarService;