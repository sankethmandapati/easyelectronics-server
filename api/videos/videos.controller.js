const fs = require('fs');
const Videos = require('./videos.model');
const { success, error, notFound } = require('../../lib/response');

exports.upload = function(req, res) {
    try {
      return success(res, {
        fileName: req.file.filename,
        uploaded: true
      });
    } catch(err) {
        console.log("Error in uploading video");
        return error(res, err, "Error in uploading video");
    }
}

exports.crate = async function(req, res) {
  try {
    req.body.uploadedBy = req.user._id;
    req.body.uploadedOn = new Date();
    const newVideo = new Videos(req.body);
    const video = await newVideo.save();
    return success(res, video);
  } catch(err) {
    console.log("Error in creating video: ", err);
    return error(res, err, "There was some error in crating video, please try again later");
  }
}

exports.getAllVideos = async function(req, res) {
  try {
    let query = {};
    if(req.user.role !== 'admin') {
      const categories = req.user.categoriesSubscribed;
      query.category = {$in: categories};
    }
    const videos = await Videos.find(query).populate('uploadedBy category').lean().exec();
    return success(res, videos);
  } catch(err) {
    return error(res, err);
  }
}

exports.getVideoById = async function(req, res) {
  try {
    let query = {
      _id: req.params.id
    };
    if(req.user.role !== 'admin') {
      const categories = req.user.categoriesSubscribed;
      query.category = {$in: categories};
    }
    const video = await Videos.findOne(query).populate('uploadedBy category').lean().exec();
    if(!video)
      return error(res, {}, 'This video is not available');
    return success(res, video);
  } catch(err) {
    return error(res, err);
  }
}

exports.streamVideo = async function(req, res) {
  try {
    const video = await Videos.findById(req.params.id).select('video').lean().exec();
    if(!video) {
      return notFound(res, "Requested video not found");
    }

    const path = `public/uploads/videos/${video.video}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if(range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1;
      const chunksize = (end-start) + 1;
      const file = fs.createReadStream(path, {start, end});
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }


  } catch(err) {
    console.log("Error in streaming video: ", err);
    return error("Error in streaming video");
  }
}
