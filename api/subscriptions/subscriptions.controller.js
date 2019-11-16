var moment = require('moment');
var Subscriptions = require('./subscriptions.model');
var { getPlanDetails, getPlanById } = require('../subscriptionPlans/subscriptionPlans.controller');
var { updateUser } = require('../users/users.controller');
var  { success, error, notFound } = require('../../lib/response');

exports.getAll = async function(req, res) {
    try {
        const subscriptions = await Subscriptions.find({})
            .populate('auth acceptedBy rejectedBy transactionId subscriptionPlan ')
            .lean().exec();
        return success(res, subscriptions);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in fetching subscriptions.. please try later");
    }
}

exports.create = async function(req, res) {
    try {
        const subscriptionsCount = await Subscriptions.count({});
        const subscriptionPlan = await getPlanById(req.body.subscriptionPlan);
        const reqId = `EASY_${moment(new Date()).format('DDMMYYYY')}_SUB_${subscriptionsCount}`;
        const newSubscription = new Subscriptions({
            user: req.user._id,
            requestedOn: new Date(),
            subscriptionPlan: subscriptionPlan._id,
            requestId: reqId,
            transactionId: req.body.transactionId,
            transactionMode: req.body.transactionMode
        });
        const subscription = await newSubscription.save();
        return success(res, subscription);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in creating subscription, please try later");
    }
}

async function updateSubscription(subId, patch) {
    try {
        const update = await Subscriptions.findOneAndUpdate({_id: subId}, {$set: {...patch}}, {returnOriginal:false, new: true});
        return update;
    } catch(err) {
        console.log("Error: ", err);
        throw err;
    }
}

exports.approve = async function(req, res) {
    try {
        const { validityInDays, categories } = await getPlanDetails(req.body.planId);
        const patch = {
            acceptedBy: req.user._id,
            acceptedOn: new Date(),
            accepted: true,
            validUpto: moment(new Date()).add('days', validityInDays),
            active: true
        };
        const { user } = await updateSubscription(req.params.id, patch);
        await updateUser({
            id: user,
            patch: {
                $push: {
                    categoriesSubscribed: {
                        $each: categories
                    }
                }
            }
        });
        return success(res, "Approval done successfully");
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in approving subscriptions, please try again");
    }
}

exports.reject = async function(req, res) {
    try {
        const patch = {
            rejectedBy: req.user._id,
            rejectedOn: new Date(),
            rejected: true,
            message: req.body.message || '',
            active: false
        };
        await updateSubscription(req.params.id, patch);
        return success(res, "Rejection done successfully");
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in rejecting the subscription");
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
            return notFound(res, "No subscriptions found with this id");
        return success(res, subscriptions);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in getting subscription details");
    }
}

exports.getPendingRequests = async function(req, res) {
    try {
        const query = {accepted: false, rejected: false, active: false};
        if(req.user.role !== 'admin')
            query.user = req.user._id;
        const subscriptions = await Subscriptions.find(query)
            .populate([{
                path: 'user',
                select: 'name'
            }, {
                path: 'subscriptionPlan'
            }]).lean().exec();
        return success(res, subscriptions);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in getting subscriptions");
    }
}
