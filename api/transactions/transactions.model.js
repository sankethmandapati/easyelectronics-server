var mongoose = require('mongoose');

const TransactionsModel = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    transactionMode: {
        type: String,
        required: true,
        enum: [
            'NEFT',
            'IMPS',
            'UPI',
            'PAYTM'
        ]
    },
    transactionApproved: {
        type: Boolean,
        default: false
    },
    transactionApprovedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: Date,
    transactionDeclined: {
        type: Boolean,
        default: false
    },
    declinationDate: Date,
    reasonForDeclining: String,
    transactionDeclineddBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Transaction', TransactionsModel);