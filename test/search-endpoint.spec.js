const app = require('../src/app');

describe('Untappd endpoints', () => {
    it('returns data from a beer search to /api/search/:beer_name', () => {
        let beerSearchTerm = 'bourbon+county+2019';
        return supertest(app)
            .get(`/api/search/${beerSearchTerm}`)
            .expect(200)
            .expect(res => 
                expect(res.text).to.exist
            )
    })

    it('returns data from a detailed beer search to /api/add/:bid', () => {
        let bid = 2789250;
        return supertest(app)
            .get(`/api/add/${bid}`)
            .expect(200)
            .expect(res => {
                expect(res.text).to.exist
            })
    })
})