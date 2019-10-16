var router = require('express').Router();
var transactionsController = require('./transactions.controller');
var auth = require('../auth/auth.service');

router.get('/:id', auth.authenticate, transactionsController.getTransactionById);
router.post('/', auth.authenticate, transactionsController.create);
router.post('/getTransactions', auth.authenticate, transactionsController.getTransactions);
router.put('/approve/:id', auth.isAdmin, transactionsController.approve);
router.put('/decline/:id', auth.isAdmin, transactionsController.reject);

module.exports = router;