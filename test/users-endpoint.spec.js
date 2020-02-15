const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('/api/users endpoint', () => {
    let db

    const testUsers = helpers.makeUsersArray();

    before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('POST /api/users', () => {
        //beforeEach('seed users', helpers.seedUsersTable(db, testUsers));

        it('responds with 201 and the created user with successful credentials', () => {
            let newUser = {
                username: 'new-user',
                user_password: 'newPassword123'
            }

            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.id).to.exist
                    //console.log(res)
                    expect(res.body.username).to.eql(newUser.username)
                })
        })
    })
})