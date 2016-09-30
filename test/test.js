/* global describe it before after */

'use strict';
const assert = require('assert');
const request = require('request');
const binstaface = require('../lib');

describe('messages service', function() {
  const PORT = 4455;
  let server;

  before(function(done) {
    server = binstaface()
      .listen(PORT, () => done());
  });

  after(function(done) {
    server.close(() => done());
  });

  it('should respond with messages array and 200 status code', function(done) {
    request(`http://localhost:${PORT}/messages`, (error, res, body) => {
      if(error) {
        return done(error);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(body, JSON.stringify([{_id: 1, message: 'Here We Go!', sentBy: 'ivan'}]));
      done();
    });
  });

  it('should respond with single message based on id and 200 status code', function(done) {
    request(`http://localhost:${PORT}/messages/1`, (error, res, body) => {
      if(error) {
        return done(error);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(body, JSON.stringify({_id: 1, message: 'Here We Go!', sentBy: 'ivan'}));
      done();
    });
  });
  describe('PUT requests', function(){
    
    it('should properly handle a put request if the message exists with status code 200', function(done) {
      request.put(`http://localhost:${PORT}/messages/1`).json({sentBy: 'john'})
        .on('response', function(res){
          assert.equal(res.statusCode, 200);
          done();
        });
    });

    it('should replace entire message object with data in put request', function(done) {
      request(`http://localhost:${PORT}/messages/1`, (error, res, body) => {
        if(error) {
          return done(error);
        }

        assert.equal(body, JSON.stringify({_id: 1,sentBy: 'john'}));
        done();
      });
    });

    it('should properly handle a put request if the message does not exist with 201 status code', function(done) {
      request.put(`http://localhost:${PORT}/messages/2`).json({sentBy: 'ivan', message: 'test message'})
        .on('response', function(response){
          assert.equal(response.statusCode, 201);
          done();
        });
    });

    it('should add new message to messages array', function(done){
      request(`http://localhost:${PORT}/messages`, (error, res, body) => {
        if(error) {
          return done(error);
        }

        assert.equal(JSON.parse(body).length, 2);
        done();
      });
    });
  });

  describe('PATCH requests', function(){
    it('should respond with a 404 if message does not exist', function(done){
      request.patch(`http://localhost:${PORT}/messages/3`).json({sentBy: 'john'})
      .on('response', function(res){
        assert.equal(res.statusCode, 404);
        done();
      });
    });

    it('should handle patch request appropriately with status code 200 if message exists', function(done){
      request.patch(`http://localhost:${PORT}/messages/2`).json({sentBy: 'john'})
        .on('response', function(res){
          assert.equal(res.statusCode, 200);
          done();
        });
    });

    it('should only change fields sent in put request', function(done){
      request(`http://localhost:${PORT}/messages/2`, (error, res, body) => {
        if(error) {
          return done(error);
        }

        assert.equal(body, JSON.stringify({_id:2,'sentBy':'john','message':'test message'}));
        done();
      });
    });
  });
  
});
