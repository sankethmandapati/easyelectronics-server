const Users = require('../users/users.model');
const usersController = require('../users/users.controller');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateJwt(userDetails) {
    const obj = {
        userId: userDetails._id,
        userName: userDetails.name,
        loginTime: new Date()
    };
    var token = jwt.sign(obj, "e@$yE|ecTr0n!c$");
    obj.accessToken = token;
    return obj;
}

exports.authenticate = (token) => {
    return new Promise((resolve, reject) => {
        if(!token) {
            return reject("Token not found");
        }
        jwt.verify(token, 'e@$yE|ecTr0n!c$', function(err, decoded) {
            if(err || !decoded) {
                return reject("Failed to authenticate user");
            }
            Users.findById(decoded.userId).select('-password').lean()
            .then((user) => {
                if(!user)
                    return reject("Unable to identify the user");
                else if(!user.emailVerified)
                    return reject("Email address not verified");
                return resolve(user);
            })
            .catch((err) => {
                return reject("Problem in finding the user details");
            });
        });
    });
}

exports.register = async (data) => {
    try {
        const response = await usersController.create(data);
        return response;
    } catch(err) {
        console.log("error in auth service: ", err);
        throw err;
    }
}

exports.login = async (data) => {
    try {
        const response = await usersController.getUser({email: data.email});
        if(!response.emailVerified) {
            //User's email id not verified
            throw new Error("Email id not verified");
        } else if(bcrypt.compareSync(data.password, response.password)) {
            // Passwords match
            const authObj = generateJwt(response);
            return authObj;
        } else {
            // Passwords don't match
            throw new Error("Wrong password");
        }
    } catch(err) {
        throw err;
    }
}

exports.logout = async (data) => {
    try {
        return true;
    } catch(err) {
        throw err;
    }
}

exports.changePassword = (data) => {};