var users = [
  {id: 1, name: 'Trent'},
  {id: 2, name: 'Joe'},
  {id: 3, name: 'Rich'},
  {id: 4, name: 'John'},
  {id: 5, name: 'Leon'},
  {id: 6, name: 'Zach'},
];


module.exports = function(app) {
  var express = require('express');
  var usersRouter = express.Router();

  usersRouter.get('/', function(req, res) {
    var isOnline = checkIsOnline(req.header('isOnline'));
    var usersCount = req.header('usersCount') || users.length;

    if(isOnline) {
      res.send({'users': getUsers(usersCount)});
    } else {
      res.status(0).end();
    }
  });

  usersRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  usersRouter.get('/:id', function(req, res) {
    var isOnline = checkIsOnline(req.header('isOnline'));
    var userName = req.header('userName');

    var id = req.params.id;
    var user = userName ? {id: id, name: userName} : getUserById(id);

    if(isOnline) {
      res.send({
        'users': user
      });
    } else {
      res.status(0).end();
    }
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
  return users.filter(function(user) { return user.id <= count; });
}

function getUserById(id) {
  return users[id - 1];
}

function checkIsOnline(headerIsOnline) {
  var isOnline = typeof headerIsOnline === 'undefined' ?
    true :
    headerIsOnline === 'true' || headerIsOnline === true; // used to overwrite

  console.log('isOnline:', isOnline);

  return isOnline;
}
