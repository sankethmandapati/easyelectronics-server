var Categories = require('./categories.model');
const { success, error, notFound } = require('../../lib/response');

exports.create = async function(req, res) {
    try {
        const newCategory = new Categories(req.body);
        await newCategory.save();
        return success(res, newCategory);
    } catch(err) {
        console.log("Error in creating a new category: ", err);
        return error(res, err, "Error in creating a new category, please try again");
    }
}

exports.read = async function(req, res) {
    try {
        const categories = await Categories.find({}).lean().exec();
        return success(res, categories);
    } catch(err) {
        console.log("Error in retriving categories from DB: ", err);
        return error(res, err, "Error in retriving errors, try again");
    }
}

exports.readById = async function(req, res) {
    try {
        const category = await Categories.findById(req.params.id).lean().exec();
        if(!category)
            return notFound(res, "Selected category not found");
        return success(res, category);
    } catch(err) {
        console.log("Error in getting a category by its id: ", err);
        return error(res, err, "Error in retrieving a category by its id, please try again");
    }
}

exports.update = async function(req, res) {
    try {
        const updateObj = await Categories.update({_id: req.params.id}, {$set: req.body}, {new: true});
        return success(res, updateObj);
    } catch(err) {
        console.log("Error in updating the category: ", err);
        return error(res, err, "Error occured while trying to update, please try again");
    }
}

exports.delete = async function(req, res) {   
    try {
        await Categories.update({_id: req.params.id}, {$set: {active: false}}, {new: true});
        return success(res, "Category removed successfully");
    } catch(err) {
        console.log("Error in updating the category: ", err);
        return error(res, err, "Error occured while trying to update, please try again");
    }
}
