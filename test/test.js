/* global describe it before after */

'use strict';
const assert = require('assert');
const request = require('request');
const binstaface = require('../lib');

describe('messages service', function() {
  const PORT = 4455;
  let server;

  const req = request.defaults({
    baseUrl: `http://localhost:${PORT}/messages`,
    json: true
  });
  before(function(done) {
    server = binstaface()
      .listen(PORT, () => done());
  });

  after(function(done) {
    server.close(() => done());
  });

  it('should respond with messages array and 200 status code', function(done) {
    req('/', (error, res, body) => {
      if(error) {
        return done(error);
      }

      assert.equal(res.statusCode, 200);
      assert.deepEqual(body, [{_id: 1, message: 'Here We Go!', sentBy: 'ivan'}]);
      done();
    });
  });

  it('should respond with single message based on id and 200 status code', function(done) {
    req('/1', (error, res, body) => {
      if(error) {
        return done(error);
      }

      assert.equal(res.statusCode, 200);
      assert.deepEqual(body, {_id: 1, message: 'Here We Go!', sentBy: 'ivan'});
      done();
    });
  });

  describe('PUT requests', function(){   
    it('should respond with status code 200 if message exists', function(done) {
      req.put('/1').json({sentBy: 'john'})
        .on('response', function(res){
          assert.equal(res.statusCode, 200);
          done();
        });
    });

    it('should replace entire message object with data in put request', function(done) {
      req('/1', (error, res, body) => {
        if(error) {
          return done(error);
        }

        assert.deepEqual(body, {_id: 1,sentBy: 'john'});
        done();
      });
    });

    it('should respond with status code 201 if message does not exist', function(done) {
      req.put('/8').json({sentBy: 'ivan', message: 'test message'})
        .on('response', function(response){
          assert.equal(response.statusCode, 201);
          done();
        });
    });

    it('should add new message to messages array', function(done){
      req('/', (error, res, body) => {
        if(error) {
          return done(error);
        }

        assert.equal(body.length, 2);
        done();
      });
    });
  });

  describe('POST requests', function(){
    it('should respond with status code 201', function(done) {
      req.post('/').json({sentBy: 'sarah', message: 'tell me about it'})
        .on('response', function(res){
          assert.equal(res.statusCode, 201);
          done();
        });
    });

    it('should create new message with correct id', function(done) {
      req('/9', (error, res, body) => {
        if(error) {
          return done(error);
        }

        assert.equal(res.statusCode, 200);
        assert.deepEqual(body, {_id: 9, sentBy: 'sarah', message: 'tell me about it'});
        done();
      });
    });
  });

  describe('PATCH requests', function(){
    it('should respond with a 404 if message does not exist', function(done){
      req.patch('/4').json({sentBy: 'john'})
      .on('response', function(res){
        assert.equal(res.statusCode, 404);
        done();
      });
    });

    it('should handle patch request appropriately with status code 200 if message exists', function(done){
      req.patch('/8').json({sentBy: 'john'})
        .on('response', function(res){
          assert.equal(res.statusCode, 200);
          done();
        });
    });

    it('should only change fields sent in put request', function(done){
      req('/8', (error, res, body) => {
        if(error) {
          return done(error);
        }

        assert.deepEqual(body, {_id:8,'sentBy':'john','message':'test message'});
        done();
      });
    });
  });
  
});
