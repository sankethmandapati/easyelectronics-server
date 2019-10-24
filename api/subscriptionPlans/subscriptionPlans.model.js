var mongoose = require('mongoose');

var SubscriptionPlansSchema = new mongoose.Schema({
    validityInDays: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: String,
    name: {
        type: String,
        required: true
    },
    categories: [mongoose.Schema.Types.ObjectId],
    active: {
        type: Boolean,
        default: true
    }
}); 

module.exports = mongoose.model('SubscriptionPlans', SubscriptionPlansSchema);