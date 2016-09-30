'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let id = 1;
const messages = [{_id: 1, message: 'Here We Go!', sentBy: 'ivan'}];
const getId = (req, res, next) => {
  const number = parseInt(req.params.id, 10);
  
  if(!isNaN(number)) {
    req.id = number;
  }

  next();
};
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
    if(!req.message){
      res.sendStatus(404);
      return;
    }
    res.json(req.message);
  });

  app.post('/messages', (req, res) => {
    const data = Object.assign({
      _id: ++id
    }, req.body);

    messages.push(data);
    res.status(201);
    res.json(data);
  });

  app.put('/messages/:id', getId, findMessage, (req, res) => {
    if (req.message){
      messages[req.index] = Object.assign({_id: req.id}, req.body);
      res.status(200);
      res.json(messages[req.index]);
    } else {
      let message = Object.assign({_id: req.id}, req.body);
      messages.push(message);
      id = req.id;
      res.status(201);
      res.json(message);
    }
  });

  app.patch('/messages/:id', getId, findMessage, (req, res) => {
    if(!req.message){
      res.sendStatus(404);
      return;
    }

    Object.assign(req.message, req.body);
    res.sendStatus(200);  
  });

  return app;
};