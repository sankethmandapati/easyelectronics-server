var UsersModel = require('./users.model');
var mailer = require('../../lib/mailer');
// var response = require('../../lib/response');

const sendMail = async (emailId, name, id) => {
    try {
        const subject = "Verify Your email address";
        const text = `Hi ${name}, Please verify your email address by clicking on the below link`;
        const html = `<div>
            <p>
                Hi ${name},
            <p>
            <br/>
            <br/>
            <p>
                Please verify your email address by clicking on the below link
            </p>
            <p>
                <a href="http://3.16.10.225:4000/users/verifyMail/${id}">Click here</a>
                <span>
                    to verify your email
                </span>
            <p>
            <br/>
            <br/>
            <b>Best Regards</b>
            <b>Team Easy Electronics</b>
        </div>`;
        await mailer(emailId, subject, text, html);
        return "Verification email sent";
    } catch(err) {
        throw new Error("Unable to send verification email");
    }
}

exports.create = async (reqData) => {
    try {
        reqData.created_at = new Date();
        const newUser = new UsersModel(reqData);
        const data = await newUser.save();
        await sendMail(data.email, data.name, data._id);
        return {msg: "A verification mail has been sent to your email id, please check"};
    } catch(err) {
        console.log("error in user controller: ", err);
        throw err;
    };
}

exports.readAll = async () => {
    try {
        const users = await UsersModel.find().select('-password').lean().exec();
        return users;
    } catch(err) {
        throw err;
    }
}

exports.getUser = async (querry) => {
    try {
        if(querry.email) {
            querry.email = querry.email.toLowerCase();
        }
        const user = await UsersModel.findOne(querry).lean().exec();
        if(!user) {
            throw new Error("User details not found");
        }
        return user;
    } catch(err) {
        console.log("Error: ", err);
        throw new Error("We are facing some problem in finding the user details");
    }
}

exports.getUsers = async (selfId, querry) => {
    try {
        let obj = {_id: {$ne: selfId}, ...querry};
        const users = await UsersModel.find(obj).select('-password').lean().exec();
        return users;
    } catch(err) {
        throw err;
    }
}

exports.updateUser = async (data) => {
    try {
        await UsersModel.update({_id: data.id}, {$set: data.body});
        return {msg: "updated successfully"};
    } catch(err) {
        throw err;
    }
}

exports.removeUser = async (id) => {
    try {
        await UsersModel.remove({_id: id});
        return {msg: "user removed successfully"};
    } catch(err) {
        throw err;
    }
}

exports.verifyMail = async (_id) => {
    try {
        const user = await UsersModel.findOne({_id});
        if(!user)
            throw new Error("User details not found, please try again after some time");
        await UsersModel.findOneAndUpdate({_id}, {$set: {emailVerified: true}});
        return "Email id verified successfully, goto http://3.16.10.225:8080/login to login to your account";
    } catch(err) {
        console.log("Error in verifying email");
        throw new Error("Internal server error");
    }
}

exports.searchUsers = async (searchKeyword, selfId) => {
    try {
        const searchRegexp = {$regex: new RegExp(searchKeyword, 'ig')};
        const users = await UsersModel
            .find({
                _id: {$ne: selfId},
                $or: [{
                    email: searchRegexp
                }, {
                    name: searchRegexp
                }]
            })
            .select('_id name email')
            .lean()
            .exec();
        return {
            success: true,
            data: users
        };
    } catch(err) {
        console.log("err: ", err);
        throw err;
    }
}