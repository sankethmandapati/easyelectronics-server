exports.success = function(res, response, status = 200) {
    return res.status(status).send({
        success: true,
        response
    });
};

exports.unAuthorised = function(
    res,
    errorMessage = "Failed to authorise user, please login again"
) {
    return res.status(401).send({
        success: false,
        errorMessage
    });
};

exports.forbidden = function(res) {
    return res.status(403).send({
        success: false,
        errorMessage: "You are not allowed to access this data."
    });
};

exports.notFound = function(
    res, 
    errorMessage = "The information you are looking for, not found"
) {
    return res.status(404).send({
        success: false,
        errorMessage
    });
};

exports.error = function(
    res, 
    err, 
    errorMessage = "Error occured while processing your request, please try again", 
    status = 500
) {
    console.log("error response: ", err.message, errorMessage);
    return res.status(status).send({
        success: false,
        errorMessage
    });
};
