var mongoose = require('mongoose');

var VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    uploadedOn: {
        type: Date,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    videoType: String,
    description: String
});

module.exports = mongoose.model('Video', VideoSchema);