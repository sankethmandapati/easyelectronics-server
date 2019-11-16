const router = require('express').Router();
const authService = require('./auth.service');
const {success, forbidden, unAuthorised} = require('../../lib/response');

router.post('/login', async (req, res) => {
    try {
        const resp = await authService.login(req.body);
        return success(res, resp);
    } catch(err) {
        return unAuthorised(res, err.message);
    }
});

router.post('/register', async (req, res) => {
    try {
        const resp = await authService.register(req.body);
        return success(res, resp);
    } catch(err) {
        console.log("error in route: ", err);
        return forbidden(res, err.message);
    }
});

router.get('/', authService.authenticate, (req, res) => {
    try {
        return success(res, req.user);
    } catch(err) {
        console.log("error in route: ", err);
        return unAuthorised(err.message);
    }
});

module.exports = router;