var mongoose = require('mongoose');

var SubscriptionsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    transactionAmount: {
        type: Number,
        required: true
    },
    transactionMode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountDetail',
        required: true
    },
    requestedOn: {
        type: Date,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    acceptedOn: Date,
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejected: {
        type: Boolean,
        default: false
    },
    rejectedOn: Date,
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String,
    subscriptionPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlans'
    },
    validUpto: Date,
    active: {
        type: Boolean,
        default: false
    },
    requestId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Subscription', SubscriptionsSchema);
