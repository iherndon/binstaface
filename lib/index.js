'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const messages = [{_id: 1, message: 'Here We Go!', sentBy: 'ivan'}];
const getId = (req, res, next) => {
  const number = parseInt(req.params.id, 10);
  
  if(!isNaN(number)) {
    req.id = number;
  }

  next();
}
const findMessage = (req, res, next) => {
  const id = req.id;
  let message = undefined;
  let index = undefined;
  for (var i = 0; i < messages.length; i++){
    if(messages[i]['_id'] == id){
      message = messages[i];
      index = i;
    }
  }

  req.message = message;
  req.index = index;
  next();
};




module.exports = function(){

  app.use(bodyParser.json());

  app.get('/messages', (req, res) => {
    res.json(messages);
  });

  app.get('/messages/:id', getId, findMessage, (req, res) => {
    res.json(req.message);
  });

  app.put('/messages/:id', getId, findMessage, (req, res) => {
    // const id = parseInt(req.params.id);
    // let currentMessage = findMessage('_id', id);
    let message = null;
    if (req.message){
      messages[req.index] = Object.assign({_id: req.id}, req.body);
      res.sendStatus(200);
    } else {
      message = Object.assign({_id: req.id}, req.body);
      messages.push(message);
      res.sendStatus(201);
    }
  });

  app.patch('/messages/:id', getId, findMessage, (req, res) => {
    if(req.message){
      Object.assign(req.message, req.body);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  return app;
};