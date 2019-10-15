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

function authenticateJwt(token) {
    return new Promise((resolve, reject) => {
        try {
            if(!token) {
                throw new Error("Token not found");
            }
            jwt.verify(token, 'e@$yE|ecTr0n!c$', async function(err, decoded) {
                if(err || !decoded) {
                    throw new Error("Failed to authenticate user");
                }
                const user = await Users.findById(decoded.userId).select('-password').lean();
                if(!user)
                    throw new Error("Unable to authenticate the user");
                else if(!user.emailVerified)
                    throw new Error("Email address not verified");
                resolve(user);
            });
        } catch(err) {
            console.log("err: ", err);
            throw err;
        }
    });
}

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.accesstoken;
        req.user = await authenticateJwt(token);
        next();
    } catch(err) {
        return res.status(403).send(err.message);
    }
};

exports.isAdmin = async function(req, res, next) {
    try {
        const token = req.headers.accesstoken;
        const user = await authenticateJwt(token);
        if(user.role !== 'admin') {
            return res.status(403).send("You dont have permission to perform this operation");
        }
        req.user = user;
        next();
    } catch(err) {
        return res.status(403).send(err.message);
    }
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