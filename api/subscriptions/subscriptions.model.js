var mongoose = require('mongoose');

var SubscriptionsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    validUpto: Date,
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    subscriptionPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
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
