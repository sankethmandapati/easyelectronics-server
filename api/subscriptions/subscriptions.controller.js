var Subscriptions = require('./subscriptions.model');
var Transactions = require('../transactions/transactions.model');
var SubscriptionPlans = require('../subscriptionPlans/subscriptionPlans.model');
var moment = require('moment');


exports.getAll = async function(req, res) {
    try {
        const subscriptions = await Subscriptions.find({})
            .populate('auth acceptedBy rejectedBy transactionId subscriptionPlan ')
            .lean().exec();
        return res.send(subscriptions);
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in fetching subscriptions.. please try later");
    }
}

exports.create = async function(req, res) {
    try {
        const transactionsCount = await Transactions.count({});
        const reqId = `EASY_${moment(new Date()).format('DDMMYYYY')}_SUB_${transactionsCount}`;
        const subscriptions = req.body.subscription.categories.map(s => ({
            user: req.user._id,
            requestedOn: new Date(),
            transactionId: req.body.transactionId,
            subscriptionPlan: s,
            requestId: reqId
        }));
        await Subscriptions.insertMany(subscriptions);
        return res.send("Successfully placed request for subscription, your request will be processed soon");
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in creating subscription, please try later");
    }
}

async function getPlanValidity(planId) {
    const sub = await SubscriptionPlans
    .findById(planId)
    .select('validityInDays')
    .lean()
    .exec();
    return sub ? sub.validityInDays : null;
}

exports.subscriptionApproval = async function(req, res) {
    try {
        if(req.body.plans && req.body.plans.length > 0) {
            for(let i = 0; i < req.body.plans.length; i++) {
                const {planId, subId, accept} = req.body.plans[i];
                let patch = {};
                if(accept) {
                    const validityInDays = await getPlanValidity(planId);
                    patch = {
                        acceptedBy: req.user._id,
                        acceptedOn: new Date(),
                        accepted: true,
                        validUpto: moment(new Date()).add('days', validityInDays),
                        active: true
                    };
                } else {
                    patch = {
                        rejectedBy: req.user._id,
                        rejectedOn: new Date(),
                        rejected: true,
                        active: false
                    };
                }
                await Subscriptions.update({_id: subId}, {$set: patch});
            }
        }
        if(req.body.reject && req.body.reject.length > 0) {
            for(let i = 0; i < req.body.reject.length; i++) {
                const {subId} = req.body.reject[i];
                await Subscriptions.update({_id: subId}, {$set: patch});
            }
        }
        return res.send("Approval done successfully");
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in approving subscriptions, please try again");
    }
}

exports.getRequestDetailsById = async function(req, res) {
    try {
        const subscriptions = await Subscriptions.find({requestId: req.params.id})
            .populate([{
                path: 'user',
                select: 'name'
            }, {
                path: 'transactionId'
            }, {
                path: 'subscriptionPlan'
            }]).lean().exec();
        if(subscriptions.length === 0)
            return res.send("No subscriptions found with this id");
        return res.send(subscriptions);
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in getting subscription details");
    }
}

exports.getPendingRequests = async function(req, res) {
    try {
        const query = {accepted: false, rejected: false};
        if(req.user.role !== 'admin')
            query.user = req.user._id;
        const subscriptions = Subscriptions.find(query)
            .populate([{
                path: 'user',
                select: 'name'
            }, {
                path: 'transactionId'
            }, {
                path: 'subscriptionPlan'
            }]).lean().exec();
        return res.send(subscriptions);
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in getting subscriptions");
    }
}