var router = require('express').Router();
var subscriptionsController = require('./subscriptions.controller');
var auth = require('../auth/auth.service');

router.post('/', auth.authenticate, subscriptionsController.create);
router.get('/', auth.isAdmin, subscriptionsController.getAll);
router.post('/approve', auth.isAdmin, subscriptionsController.subscriptionApproval);
router.post('/getPendingRequests', auth.authenticate, subscriptionsController.getPendingRequests);
router.get('/:id', auth.authenticate, subscriptionsController.getRequestDetailsById);

module.exports = router;