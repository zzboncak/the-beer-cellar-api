const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');

describe('/api/auth/login endpoint', () => {
    let db

    const testUsers = helpers.makeUsersArray();

    before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    beforeEach('seed the users tables', () => helpers.seedUsersTable(db, testUsers));

    afterEach('cleanup the tables', () => helpers.cleanTables(db));

    it('successfully returns a JWT when a user submits good credentials', () => {
        let userToLogIn = testUsers[0]; //the hashed password of this user is 'password'

        return supertest(app)
            .post('/api/auth/login')
            .send({
                username: userToLogIn.username,
                user_password: 'password'
            })
            .expect(200)
            .expect(res => { //check that the returned JWT contains the username of the user that tried to log in
                let responsePayload = AuthService.verifyJwt(res.body.authToken);
                expect(responsePayload.sub).to.eql(userToLogIn.username);
            })
    })
})