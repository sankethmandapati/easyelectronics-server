var AccountDetails = require('./accountDetails.model');
var {success, notFound, error} = require('../../lib/response');

exports.create = async function(req, res) {
    try {
        const newAccountDetails = new AccountDetails(req.body);
        await newAccountDetails.save();
        return success(res, newAccountDetails);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, null);
    }
}
exports.read = async function(req, res) {
    try {
        const accountDetails = await AccountDetails.find().lean().exec();
        return success(res, accountDetails);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, null);
    }
}
exports.readById = async function(req, res) {
    try {
        const accountDetail = await AccountDetails.findById(req.params.id).lean().exec();
        if(!accountDetail)
            return notFound(res, 'Account details you are trying to search were not found!!');
        return success(res, accountDetail);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, null);
    }
}
exports.update = async function(req, res) {
    try {
        const updatedData = await AccountDetails.update({_id: req.params.id}, {$set: req.body}, {new: true});
        return success(res, updatedData);
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, null);
    }
}
exports.delete = async function(req, res) {
    try {
        await AccountDetails.remove({_id: req.params.id});
        return success(res, {});
    } catch(err) {
        console.log("Error: ", err);
        return error(res, err, null);
    }
}