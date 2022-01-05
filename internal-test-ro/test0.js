const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.ts');
const expect = chai.expect;
chai.use(chaiHttp);

const Promise = require("bluebird");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const fs = require('fs');
const dir = './internal-test-ro/data/';
const testFolder = './internal-test-ro/data';
let testCaseNames = fs.readFileSync(dir + 'description.txt', 'utf8').toString().split('\n');


describe('trades_test ', function() {
	this.timeout(120*2000);

	let id = 0;
	fs.readdirSync(testFolder).sort().forEach(file => {
		if (file[0] !== '.' && file !== 'description.txt') {
			it(testCaseNames[id], (done) => {
				let i = 0;
				let event = [];
				fs.readFileSync(dir + file, 'utf8').toString().split('\n').forEach(function (line) {
					i += 1;
					if (line) {
						event.push(line);
					}
				});
				Promise.mapSeries(event, async (e) => {
					let eve = JSON.parse(e);
					if(eve.request.method === "DELETE") {
						return await chai.request(server)
							.delete(eve.request.url)
							.then((res) => {
								return res;
							}).catch((err) => {
								return err;
							});
					}
					if (eve.request.method === "GET") {
						return await chai.request(server)
							.get(eve.request.url)
							.then((res) => {
								return res;
							}).catch((err) => {
								return err;
							});
					}

					if (eve.request.method === "POST") {
						return await chai.request(server)
							.post(eve.request.url)
							.set(eve.request.headers)
							.send(eve.request.body)
							.then((res) => {
								return res;
							}).catch((err) => {
								return err;
							});
					}

					if(eve.request.method === "PUT") {
						return await chai.request(server)
							.put(eve.request.url)
							.set(eve.request.headers)
							.send(eve.request.body)
							.then((res) => {
								return res;
							}).catch((err) => {
								return err;
							});
					}

				}).then((results) => {
					for (let j = 0; j < results.length - 1; j++) {
						const parsedEvent = JSON.parse(event[j]);
						const eventBody = parsedEvent.response.body;
						const eventResponseCode = parsedEvent.response.status_code;

						const result = results[j]
						const resStatus = result.status
						const resBody = result.body

						if(parsedEvent.request.method === "GET") {
							expect(resStatus).to.be.equal(eventResponseCode);
							if(eventResponseCode === 404) {
								continue;
							}

							expect(resBody).to.be.deep.equal(eventBody)
						}
						if (parsedEvent.request.method === "POST") {
							expect(resStatus).to.be.equal(eventResponseCode);
						}
						if (parsedEvent.request.method === "DELETE") {
							expect(resStatus).to.be.equal(eventResponseCode);
						}
						if (parsedEvent.request.method === "PUT") {
							expect(resStatus).to.be.equal(eventResponseCode);
						}

					}
					done();
				}).catch((err) => {
					console.log(err);
					done(err);
				});
			});
			id += 1;
		}
	})

});