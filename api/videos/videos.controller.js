const Videos = require('./videos.model');
exports.upload = function(req, res) {
    try {
      console.log('req: ', req.file);
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
    const newVideo = new Videos(req.body);
    const video = await newVideo.save();
    return video;
  } catch(err) {
    console.log("Error in creating video: ", err);
    return res.send("There was some error in crating video, please try again later");
  }
}