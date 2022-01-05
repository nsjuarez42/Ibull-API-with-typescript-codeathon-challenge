let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.ts');
let expect = chai.expect;
chai.use(chaiHttp);
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('Up&Running', function() {
	it('should return status 200 OK', (done) => {
		chai.request(server)
			.get('/')
			.end((err: any, res: any) => {
				expect(res).to.have.status(200);
				done();
			});
	})
});