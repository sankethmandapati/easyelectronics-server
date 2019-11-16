var router = require('express').Router();
var auth = require('../auth/auth.service');
var accountDetailsController= require('./accountDetails.controller');

router.get('/', auth.isAdmin, accountDetailsController.read);
router.get('/:id', auth.isAdmin, accountDetailsController.readById);
router.post('/', auth.isAdmin, accountDetailsController.create);
router.put('/:id', auth.isAdmin, accountDetailsController.update);
router.delete('/:id', auth.isAdmin, accountDetailsController.delete);

module.exports = router;