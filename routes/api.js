var express = require('express');
var router = express.Router();
const { check } = require('express-validator')

// custom controllers
var EventController 	= require('../app/controllers/eventController');
var ActorController 	= require('../app/controllers/actorController');
var RepoController 	= require('../app/controllers/repoController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// login routes
router.get('/actors/streak', ActorController.streak);
router.get('/actors', ActorController.index);
router.put('/actors', ActorController.create);
router.get('/repos', RepoController.index);
router.put('/repos', RepoController.create);
router.get('/events',  EventController.index);
router.get('/events/actors/(:id)', EventController.index);
router.get('/events', EventController.index);
router.post('/events', EventController.create);
router.delete('/erase', EventController.create);

module.exports = router;
