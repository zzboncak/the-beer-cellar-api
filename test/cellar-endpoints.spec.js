const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');

describe.only('/api/cellar endpoints', () => {
    let db

    const testUsers = helpers.makeUsersArray();
    const testBeers = helpers.makeBeersArray();
    const testInventory = helpers.makeInventoryArray();

    before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

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
                  beer_name: 'Beer 1',
                  quantity: 1,
                  beer_description: 'Description 1',
                  untappd_rating: 4.5,
                  brewery_name: 'Brewery 1',
                  beer_image: 'image 1'
                },
                {
                  inventory_id: 2,
                  beer_name: 'Beer 2',
                  quantity: 4,
                  beer_description: 'Description 2',
                  untappd_rating: 4.7,
                  brewery_name: 'Brewery 2',
                  beer_image: 'image 2'
                }
            ];
            
            return supertest(app)
                .get('/api/cellar')
                .set('Authorization', `Bearer ${testJwt}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.eql(expectedBeers);
                });
        })
    })

    describe(`POST /api/cellar/:bid`, () => {
        context(`Beer doesn't exists in user's cellar`, () => {
            beforeEach('seed the users tables', () => helpers.seedUsersTable(db, testUsers));

            beforeEach('seed the beers tables', () => helpers.seedBeersTable(db, testBeers));
    
            //need to do this one last since it references the users and beers
            beforeEach('seed the inventory tables', () => helpers.seedInventoryTable(db, testInventory));
    
            afterEach('cleanup the tables', () => helpers.cleanTables(db));
            
            it('Adds the beer sucsefully and responds with 201', () => {
                let loggedInUser = testUsers[0];

                let testJwt = AuthService.createJwt(loggedInUser.username, {user_id: 1});

                return supertest(app)
                    .post('/api/cellar/4499')
                    .set('Authorization', `Bearer ${testJwt}`)
                    .expect(201)
                    .then(res => expect(res.text).to.eql('Inventory added'));
            })
        })

        context(`Beer already exists in the user's inventory`, () => {
            beforeEach('seed the users tables', () => helpers.seedUsersTable(db, testUsers));

            beforeEach('seed the beers tables', () => helpers.seedBeersTable(db, testBeers));
    
            //need to do this one last since it references the users and beers
            beforeEach('seed the inventory tables', () => helpers.seedInventoryTable(db, testInventory));
    
            afterEach('cleanup the tables', () => helpers.cleanTables(db));

            it(`Adds to the inventory and responds with 201`, () => {
                let loggedInUser = testUsers[0];

                let testJwt = AuthService.createJwt(loggedInUser.username, {user_id: 1});

                return supertest(app)
                    .post('/api/cellar/4499')
                    .set('Authorization', `Bearer ${testJwt}`)
                    .expect(201)
                    .then(res => expect(res.text).to.eql('Inventory added'));
            })
        })
    })
})