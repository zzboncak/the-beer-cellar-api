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
            untappd_beer_id: 3368648,
            beer_name: 'Reserve Rye Bourbon County Brand Stout (2019)',
            untappd_rating: 4.43192,
            beer_description: `Our Reserve Bourbon County Stout releases showcase how a premium single source bourbon barrel can influence the nuances and flavors of our original BCS.The 2019 Reserve Rye is aged in 100% Rittenhouse Rye barrels - lovingly referred to as "the bartender's favorite" rye. Rittenhouse's Barrels had a unique effect on the original imperial stout, imparting flavors of fruit and spice. Reserve Rye accentuates all that makes Rittenhouse and Bourbon County unique.`,
            brewery_id: 2898,
            brewery_name: 'Goose Island Beer Co.',
            beer_image: 'https://untappd.akamaized.net/site/beer_logos/beer-3368648_3cf3d_sm.jpeg',
            beer_style: 'Stout - Imperial / Double'
          },
          {
            untappd_beer_id: 3634543,
            beer_name: 'Roll For Initiative (2020)',
            untappd_rating: 4.35374,
            beer_description: "Gather your band of intrepid heroes and journey forth on a twisting climb through spiraling peaks of earthy cassia bark capped with glistening frosted tips that sparkle with Madagascar's finest vanilla. Will you: Roll 1-10 to Drink Fresh, or 11-20 to Cellar & Save?\r\n" +
              '\r\n' +
              'This second batch of our critical hit is a cinnamon roll-inspired Bourbon Barrel Aged Imperial Vanilla Stout based on our famed Fundamental Observation recipe, then aged with even more Madagascar vanilla beans and finished with sweet, earthy cassia bark.\r\n' +
              '\r\n' +
              'Tickets go on sale at 12pm on 1/26 at tinyurl.com/RFIBLB!',
            brewery_id: 94408,
            brewery_name: 'Bottle Logic Brewing',
            beer_image: 'https://untappd.akamaized.net/site/beer_logos/beer-3634543_8863a_sm.jpeg',
            beer_style: 'Stout - Pastry'
          },
          {
            untappd_beer_id: 1529002,
            beer_name: 'Dark Lord - Marshmallow Handjee (2016)',
            untappd_rating: 4.77615,
            beer_description: 'Dark Lord aged in bourbon barrels with vanilla beans bottled with a space-themed label.',
            brewery_id: 2470,
            brewery_name: '3 Floyds Brewing Company',
            beer_image: 'https://untappd.akamaized.net/site/beer_logos/beer-1529002_336b3_sm.jpeg',
            beer_style: 'Stout - Russian Imperial'
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