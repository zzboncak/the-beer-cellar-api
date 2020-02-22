function makeUsersArray() {
    return [
        {
            username: 'test-user-1',
            user_password: '$2a$12$.WYU9w8bPAWxd7JouMT9EukJFgwwxVWHY6Ql5UjxBybYLaJHxo9yG',
        },
        {
            username: 'test-user-2',
            user_password: '$2a$12$GiLKWNmBLxK860nXGgqsn.Taq3LfIz.wSran1P7.MPVAGuSgp.KxK',
        },
        {
            username: 'test-user-3',
            user_password: 'password3',
        },
        {
            username: 'test-user-4',
            user_password: 'password4',
        },
    ]
}

function makeBeersArray() {
    return [
        {
            untappd_beer_id: 1,
            beer_name: 'Beer 1',
            untappd_rating: 4.5,
            beer_description: 'Description 1',
            brewery_id: 1,
            brewery_name: 'Brewery 1',
            beer_image: 'image 1',
            beer_style: 'Style 1'
        },
        {
            untappd_beer_id: 2,
            beer_name: 'Beer 2',
            untappd_rating: 4.7,
            beer_description: 'Description 2',
            brewery_id: 2,
            brewery_name: 'Brewery 2',
            beer_image: 'image 2',
            beer_style: 'Style 2'
        },
        {
            untappd_beer_id: 3,
            beer_name: 'Beer 3',
            untappd_rating: 5,
            beer_description: 'Description 3',
            brewery_id: 3,
            brewery_name: 'Brewery 3',
            beer_image: 'image 3',
            beer_style: 'Style 3'
        },
    ]
}

function makeInventoryArray() {
    return [
        {
            user_id: 1,
            beer_id: 1,
            quantity: 1,            
        },
        {
            user_id: 1,
            beer_id: 2,
            quantity: 4,            
        },
        {
            user_id: 2,
            beer_id: 3,
            quantity: 7,            
        },
        {
            user_id: 2,
            beer_id: 1,
            quantity: 11,            
        },
    ]
}

function cleanTables(db) {
    return db.raw(
      `TRUNCATE
        inventory,
        beers,
        users
        RESTART IDENTITY CASCADE`
    )
}

function seedBeersTable(db, beers) {
    return db
        .into('beers')
        .insert(beers)
}

function seedUsersTable(db, users) {
    return db
        .into('users')
        .insert(users)
}

function seedInventoryTable(db, inventory) {
    return db
        .into('inventory')
        .insert(inventory)
}

module.exports = {
    makeUsersArray,
    makeInventoryArray,
    makeBeersArray,
    cleanTables,
    seedBeersTable,
    seedUsersTable,
    seedInventoryTable
}