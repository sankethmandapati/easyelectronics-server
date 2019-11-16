const controller = require('./users.controller');
const router = require('express').Router();
var {success, error} = require('../../lib/response');

router.get('/', async (req, res) => {
    try {
        const resp = await controller.readAll();
        return success(res, resp);
    } catch(err) {
        return error(res);
    }
});
router.get('/:id', async (req, res) => { 
    try {
        const resp = await controller.getUser(req.params.id);
        return success(res, resp);
    } catch(err) {
        return error(res, err, err.message);
    }
});
router.post('/',  async (req, res) => {
    try {
        const resp = await controller.create(req.body);
        return success(res, resp);
    } catch(err) {
        return error(res, err);
    }
});
router.put('/:id',  async (req, res) => {
    try {
        const resp = await controller.updateUser({id: req.params.id, body: req.body});
        return success(res, resp);
    } catch(err) {
        return error(res, err);
    }
});
router.delete('/:id', async (req, res) => { 
    try {
        const resp = await controller.removeUser(req.params.id);
        return success(res, resp);
    } catch(err) {
        return error(res, err);
    }
});
router.get('/verifyMail/:id', async (req, res) => {
    try {
        const msg = await controller.verifyMail(req.params.id);
        return success(res, {msg});
    } catch(err) {
        console.log("Err: ", err);
        return error(res, err.message);
    }
});

module.exports = router;