const mongoose = require('mongoose');

const AccountDetailsSchema = new mongoose.Schema({
    modeOfTransaction: {
        type: String,
        enum: [
            'NETBANKING',
            'PAYTM',
            'UPI'
        ],
        required: true
    },
    accountHoldersName: {
        type: String,
        required: true
    },
    upiId: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    paytmNumber: String
});

module.exports = mongoose.model('AccountDetail', AccountDetailsSchema);