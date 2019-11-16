var SubscriptionPlans = require('./subscriptionPlans.model');
var { success, error, notFound } = require('../../lib/response');

async function getPlanDetails(planId) {
    const sub = await SubscriptionPlans
    .findById(planId)
    .lean()
    .exec();
    return sub || {};
}

async function getPlanById(id) {
    try {
        const subscriptionPlan = await SubscriptionPlans.findById(id)
            .populate('categories')
            .lean()
            .exec();
        return subscriptionPlan;
    } catch(err) {
        throw err;
    }
}

exports.create = async function(req, res) {
    try {
        const newSubscriptionPlan = new SubscriptionPlans(req.body);
        await newSubscriptionPlan.save();
        return success(res, newSubscriptionPlan);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in creating plan, please try again");
    }
}

exports.read = async function(req, res) {
    try {
        const subscriptionPlans = await SubscriptionPlans.find({})
            .populate('categories')
            .lean()
            .exec();
        return success(res, subscriptionPlans);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in getting subscription plans, plase try again");
    }
}

exports.readById = async function(req, res) {
    try {
        const subscriptionPlan = await getPlanById(req.params.id);
        if(!subscriptionPlan)
            return notFound(res, "Selected subscription plan details not found, please try again");
        return success(res, subscriptionPlan);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in fetcing the selected subscription plan details, please try again");
    }
}

exports.update = async function(req, res) {
    try {
        const updatedSubscriptionPlan = await SubscriptionPlans.update(
            {_id: req.params.id}, 
            {$set: req.body}, 
            {new: true}
        );
        return success(res, updatedSubscriptionPlan);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "Error in updating subscription plan details, please try again");
    }
}

exports.delete = async function(req, res) {
    try {
        await SubscriptionPlans.update({_id: req.params.id}, {$set: {active: false}});
        return success(res, "Removed subscription plan successfully");
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, "There was some problem in removing the subscription plan, please try again");
    }
}

exports.getPlanDetails = getPlanDetails;
exports.getPlanById = getPlanById;
