var router = require('express').Router();
var subscriptionPansController = require('./subscriptionPlans.controller');
var auth = require('../auth/auth.service');

router.post('/', auth.isAdmin, subscriptionPansController.create);
router.get('/', auth.authenticate, subscriptionPansController.read);
router.get('/:id', auth.authenticate, subscriptionPansController.readById);
router.put('/:id', auth.isAdmin, subscriptionPansController.update);
router.delete('/:id', auth.isAdmin, subscriptionPansController.delete);

module.exports = router;