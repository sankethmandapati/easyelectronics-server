var Categories = require('./categories.model');

exports.create = async function(req, res) {
    try {
        const newCategory = new Categories(req.body);
        await newCategory.save();
        return res.send(newCategory);
    } catch(err) {
        console.log("Error in creating a new category: ", err);
        return res.send("Error in creating a new category, please try again");
    }
}

exports.read = async function(req, res) {
    try {
        const categories = await Categories.find({}).lean().exec();
        return res.send(categories);
    } catch(err) {
        console.log("Error in retriving categories from DB: ", err);
        return res.send("Error in retriving errors, try again");
    }
}

exports.readById = async function(req, res) {
    try {
        const category = await Categories.findById(req.params.id).lean().exec();
        if(!category)
            return res.send("Selected category not found");
        return res.send(category);
    } catch(err) {
        console.log("Error in getting a category by its id: ", err);
        return res.send("Error in retrieving a category by its id, please try again");
    }
}

exports.update = async function(req, res) {
    try {
        const updateObj = await Categories.update({_id: req.params.id}, {$set: req.body}, {new: true});
        return res.send(updateObj);
    } catch(err) {
        console.log("Error in updating the category: ", err);
        return res.send("Error occured while trying to update, please try again");
    }
}

exports.delete = async function(req, res) {   
    try {
        await Categories.update({_id: req.params.id}, {$set: {active: false}}, {new: true});
        return res.send("Category removed successfully");
    } catch(err) {
        console.log("Error in updating the category: ", err);
        return res.send("Error occured while trying to update, please try again");
    }
}
