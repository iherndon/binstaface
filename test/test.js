/* global describe it before __dirname after */

'use strict';
const assert = require('assert');
const path = require('path');
const request = require('request');
const binstaface = require('../lib');

describe('my app test', function() {
  const PORT = 4455;
  let server;

  before(function(done) {
    server = binstaface(path.join(__dirname, '..'))
      .listen(PORT, () => done());
  });

  after(function(done) {
    server.close(() => done());
  });

  it('sends 404 for non-existing files', function(done) {
    request(`http://localhost:${PORT}/dummy.txt`, (error, res, body) => {
      if(error) {
        return done(error);
      }

      assert.equal(res.statusCode, 404);
      assert.equal(body, 'THERE IS A PROBLEM WITH THE FILE YOU SPECIFIED');
      done();
    });
  });

  it('sends package.json', function(done) {
    request({
      url: `http://localhost:${PORT}/package.json`,
      json: true
    }, (error, res, body) => {
      if(error) {
        return done(error);
      }

      assert(body.description, 'A picture sharing application!');
      done();
    });
  });
});
