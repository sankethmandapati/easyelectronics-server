var router = require('express').Router();
var subscriptionsController = require('./subscriptions.controller');
var auth = require('../auth/auth.service');

router.post('/', auth.authenticate, subscriptionsController.create);
router.get('/', auth.isAdmin, subscriptionsController.getAll);
router.put('/approve/:id', auth.isAdmin, subscriptionsController.approve);
router.put('/reject/:id', auth.isAdmin, subscriptionsController.reject);
router.get('/getPendingRequests', auth.authenticate, subscriptionsController.getPendingRequests);
router.get('/:id', auth.authenticate, subscriptionsController.getRequestDetailsById);

module.exports = router;