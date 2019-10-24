var router = require('express').Router();
var categoriesController = require('./categories.controller');
var auth = require('../auth/auth.service');

router.post('/', auth.isAdmin, categoriesController.create);
router.get('/', auth.authenticate, categoriesController.read);
router.get('/:id', auth.authenticate, categoriesController.readById);
router.put('/:id', auth.isAdmin, categoriesController.update);
router.delete('/:id', auth.isAdmin, categoriesController.delete);

module.exports = router;