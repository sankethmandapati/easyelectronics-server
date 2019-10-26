var SubscriptionPlans = require('./subscriptionPlans.model');

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
        return res.send(newSubscriptionPlan);
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in creating plan, please try again");
    }
}

exports.read = async function(req, res) {
    try {
        const subscriptionPlans = await SubscriptionPlans.find({})
            .populate('categories')
            .lean()
            .exec();
        return res.send(subscriptionPlans);
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in getting subscription plans, plase try again");
    }
}

exports.readById = async function(req, res) {
    try {
        const subscriptionPlan = await getPlanById(req.params.id);
        if(!subscriptionPlan)
            return res.status(404).send("Selected subscription plan details not found, please try again");
        return res.send(subscriptionPlan);
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in fetcing the selected subscription plan details, please try again");
    }
}

exports.update = async function(req, res) {
    try {
        const updatedSubscriptionPlan = await SubscriptionPlans.update(
            {_id: req.params.id}, 
            {$set: req.body}, 
            {new: true}
        );
        return res.send(updatedSubscriptionPlan);
    } catch(err) {
        console.log("Error: ", err);
        return res.send("Error in updating subscription plan details, please try again");
    }
}

exports.delete = async function(req, res) {
    try {
        await SubscriptionPlans.update({_id: req.params.id}, {$set: {active: false}});
        return res.send("Removed subscription plan successfully");
    } catch(err) {
        console.log("Error: ", err);
        return res.send("There was some problem in removing the subscription plan, please try again");
    }
}

exports.getPlanDetails = getPlanDetails;
exports.getPlanById = getPlanById;
