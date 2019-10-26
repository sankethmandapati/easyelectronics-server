const fs = require('fs');
const Videos = require('./videos.model');
const Subscriptions = require('../subscriptions/subscriptions.model');

exports.upload = function(req, res) {
    try {
      return res.send({
        fileName: req.file.filename,
        uploaded: true
      });
    } catch(err) {
        console.log("Error in uploading video");
        return res.send({
          errorMessage: "Error in uploading video",
          uploaded: false
        });
    }
}

exports.crate = async function(req, res) {
  try {
    req.body.uploadedBy = req.user._id;
    req.body.uploadedOn = new Date();
    const newVideo = new Videos(req.body);
    const video = await newVideo.save();
    return res.send(video);
  } catch(err) {
    console.log("Error in creating video: ", err);
    return res.send("There was some error in crating video, please try again later");
  }
}

exports.getAllVideos = async function(req, res) {
  try {
    let query = {};
    if(req.user.role !== 'admin') {
      const categories = req.user.categoriesSubscribed;
      query.category = {$in: categories};
      // if(categories.length > 0)
    }
    const videos = await Videos.find(query).lean().exec();
    return res.send(videos);
  } catch(err) {
    return res.send("Internal server error");
  }
}

exports.streamVideo = async function(req, res) {
  try {
    const video = await Videos.findById(req.params.id).select('video').lean().exec();
    if(!video) {
      return res.status(404).send("Requested video not found");
    }


    
  const path = `public/uploads/videos/${video.video}`
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if(range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1;
    const chunksize = (end-start) + 1;
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }


  } catch(err) {
    console.log("Error in streaming video: ", err);
    return res.send("Error in streaming video");
  }
}