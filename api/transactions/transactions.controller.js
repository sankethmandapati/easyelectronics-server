var Transaction = require('./transactions.model');

exports.create = async function(req, res) {
    try {
        const newTransaction = new Transaction({
            transactionId: req.body.transactionId,
            transactionDate: req.body.transactionDate,
            createdOn: new Date(),
            userId: req.user._id,
            transactionMode: req.body.transactionMode
        });
        await newTransaction.save();
        return res.send(newTransaction);
    } catch(err) {
        console.log("Error in creating transaction: ", err);
        return res.send("There was some error in creating transaction, please try again");
    }
}

exports.approve = async function(req, res) {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if(!transaction)
            return res.send("Selected transaction not found");
        transaction._doc.transactionApproved = true;
        transaction._doc.transactionApprovedBy = req.user._id;
        transaction._doc.approvalDate = new Date();
        await transaction.save();
        return res.send("Transaction approved successfully");
    } catch(err) {
        console.log("Error in approving transaction: ", err);
        return res.send("There was some error in approving transaction, please try again");
    }
}

exports.reject = async function(req, res) {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if(!transaction)
            return res.send("Selected transaction not found");
        transaction._doc.transactionDeclined = true;
        transaction._doc.transactionDeclineddBy = req.user._id;
        transaction._doc.declinationDate = new Date();
        transaction._doc.reasonForDeclining = req.body.reasonForDeclining;
        await transaction.save();
        return res.send("Transaction rejected successfully");
    } catch(err) {
        console.log("Error in rejecting transaction: ", err);
        return res.send("There was some error in rejecting transaction, please try again");
    }
}

exports.getTransactions = async function(req, res) {
    try {
        const {limit, pageNum} = req.query;
        const options = {};
        if(limit && pageNum) {
            options.limit = limit;
            options.skip = (pageNum * limit) - limit;
        }
        const query = req.body.query || {};
        if(req.body.timeRange) {
            query.transactionDate = {};
            req.body.timeRange.start ? query.transactionDate.$gte = req.body.timeRange.start : null;
            req.body.timeRange.end ? query.transactionDate.$lte = req.body.timeRange.end : null;
        }
        if(req.user.role !== 'admin')
            query.userId = req.user._id;
        const transactions = await Transaction.fetch({}, options).lean().exec();
        return res.send(transactions);
    } catch(err) {
        console.log("Error in getting all the transactions: ", err);
        return res.send("Error in getting transactions, try again");
    }
}

exports.getTransactionById = async function(req, res) {
    try {
        const transaction = await Transaction.findById(req.params.id).lean().exec();
        return res.send(transaction);
    } catch(err) {
        console.log("Error in getting transaction: ", err);
        return res.send("Error in getting transaction, please try again");
    }
}