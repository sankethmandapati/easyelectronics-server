var path = require('path');
module.exports = function(app) {
    app.use('/users', require('./api/users'));
    app.use('/api/v1/auth', require('./api/auth'));
    app.use('/api/v1/video', require('./api/videos'));
    app.use('/api/v1/transaction', require('./api/transactions'));
    app.use('/api/v1/categories', require('./api/categories'));
    app.use('/api/v1/subscriptions', require('./api/subscriptions'));
    app.use('/api/v1/subscriptionPlans', require('./api/subscriptionPlans'));
    app.route('/*').get(function(req, res) {
        res.sendFile(path.join(process.cwd(), '/public/index.html'));
    });
};