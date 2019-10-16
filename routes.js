var path = require('path');
module.exports = function(app) {
    app.use('/users', require('./api/users'));
    app.use('/api/v1/auth', require('./api/auth'));
    app.use('/api/v1/video', require('./api/videos'));
    app.use('/api/v1/transaction', require('./api/transactions'));
    app.route('/*').get(function(req, res) {
        res.sendFile(path.join(process.cwd(), '/public/index.html'));
    });
};