
module.exports = function(app) {
  var express = require('express');
  var usersRouter = express.Router();

  usersRouter.get('/', function(req, res) {
    // To mimic connection error
    var isOnline = typeof req.header('isOnline') === 'undefined' ?
      true :
      req.header('isOnline') === 'true';

    var usersCount = req.header('usersCount') || 6;
    console.log('isOnline:', isOnline);
    console.log('usersCount:', usersCount);

    if(isOnline) {
      var users = getUsers(usersCount);
      res.send({'users': users});
    } else {
      res.status(0).end();
    }
  });

  usersRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  usersRouter.get('/:id', function(req, res) {
    res.send({
      'users': {
        id: req.params.id
      }
    });
  });

  usersRouter.put('/:id', function(req, res) {
    res.send({
      'users': {
        id: req.params.id
      }
    });
  });

  usersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/users', usersRouter);
};

function getUsers(count) {
  var users = [
    {id: 1, name: 'Trent'},
    {id: 2, name: 'Joe'},
    {id: 3, name: 'Rich'},
    {id: 4, name: 'John'},
    {id: 5, name: 'Leon'},
    {id: 6, name: 'Zach'},
  ];

  return users.filter(function(user) { return user.id <= count; });
}
