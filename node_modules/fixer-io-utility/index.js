const http = require('http');
const queryString = require('query-string');
/**
 * A tiny fixer io request utility.
 * This class should be used when
 * dealing with the current fixer.io api
 * At the time of this writing [2018-10-25]
 * This utility should be working.
 * Kindly raise an issue if this requires changes
 */
class FixerIO {
  /**
   * The FixerIO class constructor function
   * @param {String} apiKey {Required} Fixer IO api key
   */
  constructor(apiKey) {
    if (apiKey === undefined) throw Error('Api key is a required value');
    if (typeof apiKey !== 'string') {
      throw new TypeError('Api key should be string value');
    }
    this.apiKey = apiKey;
  }

  /**
   * The request to fixer io
   * @param {String} endpoint {Required} One of the avialable
   * endpoints i.e symbol or latest.
   * @param {String} query {Optional} The api query params
   * i.e. &base, &symbol etc.
   * @return {Promise} Returns a promise
   */
  request(endpoint, query = null) {
    if (endpoint == null) throw new Error('Request endpoint missing');
    const url = `http://data.fixer.io/api/${endpoint}?access_key=${
      this.apiKey
    }`;
    const apiUrl = query != null ? `${url}&${query}` : url;
    return this._makeRequest(apiUrl);
  }

  /**
   * An object query request to fixer io - called from gatsby plugin
   * @param {String} endpoint {Required} One of the avialable
   * endpoints i.e symbol or latest.
   * @param {Object} query {Optional} The api query params in
   * key-value object i.e. {base=EUR} etc.
   * @return {Promise} Returns a promise.
   */
  reqQuery(endpoint, query = null) {
    const url = `http://data.fixer.io/api/${endpoint}?access_key=${
      this.apiKey
    }`;
    const apiUrl =
      query != null ? `${url}&${queryString.stringify(query)}` : url;
    return this._makeRequest(apiUrl);
  }

  _makeRequest(apiUrl) {
    return new Promise((resolve, reject) => {
      http
        .get(apiUrl, (res) => {
          let buffer = '';
          res.on('data', (chunk) => {
            buffer += chunk;
          });

          res.on('end', () => {
            return resolve(JSON.parse(buffer));
          });
        })
        .on('error', (err) => {
          return reject({error: err.message});
        });
    });
  }
}

module.exports = FixerIO;
