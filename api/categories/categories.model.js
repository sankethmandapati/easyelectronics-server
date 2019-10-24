var mongoose = require('mongoose');

var CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    complementary: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Category', CategoriesSchema);
