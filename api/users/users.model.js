const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNum: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: String,
    emailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: 'guest',
        enum: ['admin', 'guest']
    },
    categoriesSubscribed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]
});

UsersSchema.pre('save', async function(next) {
    if(!this.email || !this.password) {
        return next(new Error("email and password are mandatory fields"));
    }
    this.email = this.email.toLowerCase();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UsersSchema);
