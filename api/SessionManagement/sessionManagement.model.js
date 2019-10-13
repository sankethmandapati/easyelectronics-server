const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionManagementSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    loginTime: {
        type: Date,
        default: new Date()
    },
    logoutTime: Date
});

module.exports = mongoose.model('SessionManagement', SessionManagementSchema);