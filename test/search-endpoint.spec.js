const app = require('../src/app');

describe('/api/search/:beer_name endpoint', () => {
    it('returns data from a beer search', () => {
        let beerSearchTerm = 'bourbon+county+2019';
        return supertest(app)
            .get(`/api/search/${beerSearchTerm}`)
            .expect(200)
            .expect(res => 
                expect(res.text).to.exist
            )
    })
})