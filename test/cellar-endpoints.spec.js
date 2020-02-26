const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');

describe('/api/cellar endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray();
    const testBeers = helpers.makeBeersArray();
    const testInventory = helpers.makeInventoryArray();

    before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`GET /api/cellar`, () => {
        //need to seed users, beers, and inventory then make a call to see it return expected beers

        beforeEach('seed the users tables', () => helpers.seedUsersTable(db, testUsers));

        beforeEach('seed the beers tables', () => helpers.seedBeersTable(db, testBeers));

        //need to do this one last since it references the users and beers
        beforeEach('seed the inventory tables', () => helpers.seedInventoryTable(db, testInventory));

        afterEach('cleanup the tables', () => helpers.cleanTables(db));

        it(`returns the logged in users beers`, () => {
            
            let loggedInUser = testUsers[0];

            let testJwt = AuthService.createJwt(loggedInUser.username, {user_id: 1});

            let expectedBeers = [
                {
                    inventory_id: 1,
                    untappd_beer_id: 3368648,
                    beer_name: 'Reserve Rye Bourbon County Brand Stout (2019)',
                    untappd_rating: 4.43192,
                    beer_description: `Our Reserve Bourbon County Stout releases showcase how a premium single source bourbon barrel can influence the nuances and flavors of our original BCS.The 2019 Reserve Rye is aged in 100% Rittenhouse Rye barrels - lovingly referred to as "the bartender's favorite" rye. Rittenhouse's Barrels had a unique effect on the original imperial stout, imparting flavors of fruit and spice. Reserve Rye accentuates all that makes Rittenhouse and Bourbon County unique.`,
                    brewery_id: 2898,
                    quantity: 1,
                    brewery_name: 'Goose Island Beer Co.',
                    beer_image: 'https://untappd.akamaized.net/site/beer_logos/beer-3368648_3cf3d_sm.jpeg',
                    beer_style: 'Stout - Imperial / Double'
                },
                {
                    inventory_id: 2,
                    untappd_beer_id: 3634543,
                    beer_name: 'Roll For Initiative (2020)',
                    untappd_rating: 4.35374,
                    beer_description: "Gather your band of intrepid heroes and journey forth on a twisting climb through spiraling peaks of earthy cassia bark capped with glistening frosted tips that sparkle with Madagascar's finest vanilla. Will you: Roll 1-10 to Drink Fresh, or 11-20 to Cellar & Save?\r\n" +
                        '\r\n' +
                        'This second batch of our critical hit is a cinnamon roll-inspired Bourbon Barrel Aged Imperial Vanilla Stout based on our famed Fundamental Observation recipe, then aged with even more Madagascar vanilla beans and finished with sweet, earthy cassia bark.\r\n' +
                        '\r\n' +
                        'Tickets go on sale at 12pm on 1/26 at tinyurl.com/RFIBLB!',
                    brewery_id: 94408,
                    quantity: 4,
                    brewery_name: 'Bottle Logic Brewing',
                    beer_image: 'https://untappd.akamaized.net/site/beer_logos/beer-3634543_8863a_sm.jpeg',
                    beer_style: 'Stout - Pastry'
                }
            ]; //this is based on the info in the seeding functions from the test-helpers file
            
            return supertest(app)
                .get('/api/cellar')
                .set('Authorization', `Bearer ${testJwt}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.eql(expectedBeers);
                });
        })
    });

    describe(`POST /api/cellar/:bid`, () => {
        context(`Beer doesn't exists in user's cellar`, () => {
            beforeEach('seed the users tables', () => helpers.seedUsersTable(db, testUsers));

            beforeEach('seed the beers tables', () => helpers.seedBeersTable(db, testBeers));
    
            //need to do this one last since it references the users and beers
            beforeEach('seed the inventory tables', () => helpers.seedInventoryTable(db, testInventory));
    
            afterEach('cleanup the tables', () => helpers.cleanTables(db));
            
            it(`Adds a beer to the beer table if it doesn't exist`, () => {
                let loggedInUser = testUsers[0];

                let testJwt = AuthService.createJwt(loggedInUser.username, {user_id: 1});

                return supertest(app)
                    .post('/api/cellar/4499') //try to add beer with untappd id of 4499 (Pliny the Elder)
                    .set('Authorization', `Bearer ${testJwt}`)
                    .expect(201)
                    .expect(() => //then check the database that a beer exists with that untappd beer id
                        db
                        .from('beers')
                        .select('*')
                        .where({untappd_beer_id: 4499})
                        .first()
                        .then(beer => {
                            expect(beer.untappd_beer_id).to.eql(4499);
                        }));
            });

            it(`Finds the beer sucesfully, responds with 201, and shows up in the user's cellar`, () => {
                let loggedInUser = testUsers[0];

                let testJwt = AuthService.createJwt(loggedInUser.username, {user_id: 1});

                return supertest(app)
                    .post('/api/cellar/4499') //try to add beer with untappd id of 4499 (Pliny the Elder)
                    .set('Authorization', `Bearer ${testJwt}`)
                    .expect(201)
                    .then(res => expect(res.text).to.eql('Inventory added'))
                    .then(() => //then check if that beer was actually added to the logged in user's cellar
                        supertest(app)
                        .get('/api/cellar')
                        .set('Authorization', `Bearer ${testJwt}`)
                        .expect(200)
                        .then(res => {
                            let addedBeer = res.body.filter(beer => beer.untappd_beer_id === 4499)[0] //[0] because this will be an array with one object in it and we want the object
                            expect(addedBeer.untappd_beer_id).to.eql(4499)
                        }));
            });
        });

        context(`Beer already exists in the user's cellar`, () => {
            beforeEach('seed the users tables', () => helpers.seedUsersTable(db, testUsers));

            beforeEach('seed the beers tables', () => helpers.seedBeersTable(db, testBeers));
    
            //need to do this one last since it references the users and beers
            beforeEach('seed the inventory tables', () => helpers.seedInventoryTable(db, testInventory));
    
            afterEach('cleanup the tables', () => helpers.cleanTables(db));

            it(`Adds to the inventory and responds with 204 increasing the quantity by 1`, () => {
                let loggedInUser = testUsers[0];

                let testJwt = AuthService.createJwt(loggedInUser.username, {user_id: 1});

                return supertest(app)
                    .post('/api/cellar/4499') //first, add beer with untappd id of 4499 (Pliny the Elder) to the cellar
                    .set('Authorization', `Bearer ${testJwt}`)
                    .expect(201)
                    .then(res => expect(res.text).to.eql('Inventory added'))
                    .then(() => 
                        supertest(app)
                        .post('/api/cellar/4499') //then, attempt to add it again
                        .set('Authorization', `Bearer ${testJwt}`)
                        .expect(204) //the true status code of the request
                        .then(() => //then see if beer with untappd id 4499 is in the cellar with inventory of 2
                            supertest(app)
                            .get('/api/cellar')
                            .set('Authorization', `Bearer ${testJwt}`)
                            .expect(200)
                            .then(res => {
                                let addedBeer = res.body.filter(beer => beer.untappd_beer_id === 4499)[0] //[0] because this will be an array with one object in it and we want the object
                                expect(addedBeer.untappd_beer_id).to.eql(4499)
                                expect(addedBeer.quantity).to.eql(2)
                            })
                        )
                    );
            })
        })
    });

    describe(`PATCH /api/cellar/inventory`, () => {
        beforeEach('seed the users tables', () => helpers.seedUsersTable(db, testUsers));

        beforeEach('seed the beers tables', () => helpers.seedBeersTable(db, testBeers));

        //need to do this one last since it references the users and beers
        beforeEach('seed the inventory tables', () => helpers.seedInventoryTable(db, testInventory));

        afterEach('cleanup the tables', () => helpers.cleanTables(db));

        it('Adjusts the quantity of a beer for a user when he/she clicks the plus or minus button', () => {
            let loggedInUser = testUsers[0];

            let testJwt = AuthService.createJwt(loggedInUser.username, {user_id: 1});

            let requestBody = {
                inventory_id: 1,
                updatedQuantity: 2
            }

            return supertest(app)
                .patch('/api/cellar/inventory')
                .set('Authorization', `Bearer ${testJwt}`)
                .send(requestBody)
                .expect(204)
                .then(() => 
                    supertest(app)
                    .get('/api/cellar')
                    .set('Authorization', `Bearer ${testJwt}`)
                    .expect(200)
                    .then(res => {
                        let beerOfInterest = res.body.filter(beer => beer.inventory_id === requestBody.inventory_id)[0];
                        expect(beerOfInterest.quantity).to.eql(requestBody.updatedQuantity);
                    })
                );
        });
    });

    describe(`DELETE /api/cellar/inventory`, () => {
        beforeEach('seed the users tables', () => helpers.seedUsersTable(db, testUsers));

        beforeEach('seed the beers tables', () => helpers.seedBeersTable(db, testBeers));

        //need to do this one last since it references the users and beers
        beforeEach('seed the inventory tables', () => helpers.seedInventoryTable(db, testInventory));

        afterEach('cleanup the tables', () => helpers.cleanTables(db));

        it(`Deletes a line of inventory from the inventory table`, () => {
            let loggedInUser = testUsers[0];

            let testJwt = AuthService.createJwt(loggedInUser.username, {user_id: 1});

            let requestBody = {inventory_id: 1}; //i.e. delete the line of inventory with id of 1

            return supertest(app)
                .delete('/api/cellar/inventory')
                .set('Authorization', `Bearer ${testJwt}`)
                .send(requestBody)
                .expect(204)
                .expect(() =>
                    db
                    .from('inventory')
                    .select('*')
                    .where({id: 1})
                    .first()
                    .then(res => {
                        expect(res).to.not.exist
                    })
                );
        });
    });
});