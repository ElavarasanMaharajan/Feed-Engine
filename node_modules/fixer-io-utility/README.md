# fixer-io-utility

# Developers Guide

[![Build Status](https://travis-ci.org/kenigbolo/fixer-io-utility.svg?branch=master)](https://travis-ci.org/kenigbolo/fixer-io-utility)

## Getting Started

+ Clone the application with `git clone https://github.com/kenigbolo/fixer-io-utility.git` or use ssh  `git clone git@github.com:kenigbolo/fixer-io-utility.git`.

## Dependencies

* NPM 6.x
* Node 8.x
* [query-string](https://www.npmjs.com/package/query-string)

## Description

This is a tiny module that allows making requests to the fixer.io api. The npm package exposes a tiny utility class called FixerIO. The utility class can be used to leverage making requests to the the fixer.io api. This utility will be occasionaly maintained to keep up with the happenings to endpoints on [fixer.io](https://fixer.io/documentation#endpoints)

## NPM

This package has been published on [NPM](https://www.npmjs.com/package/fixer-io-utility) and is freely available according to the MIT license. To install via npm simply run `npm install fixer-io-utility`.

## NPM Package Usage
```javascript

const FixerIO = require('fixer-io-utility');
const fixerUtility = new FixerIO('put-your-api-key-here');

fixerUtility.request('latest').then((response) => {
  console.log(response);
});
```
The utility returns a resolved or rejected promise.

### Available functions

The utility exposes two core functions `request` and `reqQuery`. Both functions accept two arguments namely `endpoint` and `query` however the methods differ purely on the format of the `query` argument that they take.

`Accepted method arguments`

1. The `endpoint {Required}` - This refers to the endpoint to which the call should be made. The available options at the moment of this writing are `latest`,`symbols`, `convert`, `timeseries`, `fluctuation` and `dates e.g. YYYY-MM-DD`. Kindly consult the official [endpoint documentation](https://fixer.io/documentation#endpoints) for any endpoints not listed here, however the pluggin is flexible to support new endpoints without any changes needed whenever new plugins are available. This is the same for both the `request` method and the `reqQuery` method.

`Query for request function`

2. The `query {Optional}` - The second argument taken by the request function is the `query` params. Kindly visit the official documentation to be sure what values are allowed but at the time of writing the allowed values are `base` and `symbol or symbols`, and these are only available on the `latest` endpoint. An example query argument should look like this `base=USD&symbols=GBP,JPY,EUR`. Please note that this type of query at the moment is not availble to the `symbols` endpoint. The `convert` endpoint allows for making queries such as `from=GBP&to=JPY&amount=200` using params `from`, `to` and `amount`. The `timeseries` and `fluctuation` endpoint currently allows queries such as `start_date=2012-05-01&end_date=2012-05-27` with the available params `start_date` and `end_date`.

`Query for reqQuery function`

3. The `query {Optional}` - This refers to a javascript object constructed to match the require params in a `key - value` format. Kindly consult the official [endpoint documentation](https://fixer.io/documentation#endpoints) for the available parameter fields that can be used. The format of the query object should always mimick same as in the official documentation. 

Below is an example taken directly from the fixer.io Historical rates Endpoint documentation and converted into a gatsby configuration

From Fixer.io
```
http://data.fixer.io/api/2013-12-24
    ? access_key = API_KEY
    & base = GBP
    & symbols = USD,CAD,EUR
```
will result a `query` params constructed as a javascript key-value pair thus

```javascript
  {base: 'GBP', symbols: 'USD,CAD,EUR'}
```

`Return type`

The return type of the request method is a `Promise` which when resolved holds the data response.

## Disclaimer
I am in no way connected to those who work at fixer.io. Project is simply a side project which I will try to maintain and expand as much as I can. At the time of this writing `2018-10-26` the fixer api requires an api token when making requests.
