const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');

describe('/api/users endpoint', () => {
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

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('POST /api/users', () => {

        it('responds with 201 and the jwt', () => {
            let newUser = {
                username: 'new-user',
                user_password: 'newPassword123'
            }

            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    let responsePayload = AuthService.verifyJwt(res.body);
                    expect(responsePayload.sub).to.eql(newUser.username);
                })
        })
    })
})