const CellarService = {
    getUserBeers(knex, user_id) {
        return knex
            .select('i.id as inventory_id', 'b.beer_name', 'i.quantity', 'b.beer_description', 'b.untappd_rating', 'b.brewery_name', 'b.beer_image')
            .from('inventory as i')
            .join('beers as b', 'b.id', '=', 'i.beer_id')
            .join('users as u', 'u.id', '=', 'i.user_id')
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
    },
    updateUserInventory(knex, inventory_id, updatedQuantity) {
        return knex('inventory')
            .where('id', inventory_id)
            .update('quantity', updatedQuantity)
    }
}

module.exports = CellarService;