process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const FixerIO = require('../index');

/*
* Test the Utility functionality
*/
describe('Use utility class to make request', () => {
  const fixerUtility = new FixerIO('some-random-api-key');
  it('it should have an api key in the object', (done) => {
    expect(fixerUtility.apiKey).to.equal('some-random-api-key');
    done();
  });

  it('it should respond back with a success set to false', (done) => {
    fixerUtility.request('latest').then((res) => {
      expect(res.success).to.equal(false);
    });
    done();
  });

  it('it should have an error key in json due to invalid api key', (done) => {
    fixerUtility.request('latest').then((res) => {
      expect(res).to.have.property('error');
    });
    done();
  });

  it('it should have an error when endpoint is missing', (done) => {
    expect(fixerUtility.request).to.throw(Error, 'Request endpoint missing');
    done();
  });

  it('throws type error when api key is not a string', (done) => {
    const fixerObject = () => {
      new FixerIO(2673843734);
    };
    expect(fixerObject).to.throw(TypeError, 'Api key should be string value');
    done();
  });

  it('throws error when api key is not provided', (done) => {
    const fixerObject = () => {
      new FixerIO();
    };
    expect(fixerObject).to.throw(Error, 'Api key is a required value');
    done();
  });
});
