var router = require('express').Router();
var videoController = require('./videos.controller');
var auth = require('../auth/auth.service');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderName = (file.fieldname === 'video') ? 'videos' : 'static';
      cb(null, `public/uploads/${folderName}`);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.split('.').reduce((name, str, n) => {
        if(n === 0) {
          name = str + '_' + Date.now();
          return name;
        }
        return (name + '.' + str);
      }, '');
      cb(null, fileName);
    }
});
var upload = multer({storage: storage});


router.post('/uploadVideo', auth.isAdmin, upload.single('video'), videoController.upload);
router.post('/uploadThumbnail', auth.isAdmin, upload.single('thumbnail'), videoController.upload);
router.post('/create', auth.authenticate, videoController.crate);
router.get('/', auth.authenticate, videoController.getAllVideos);
router.get('/streamVideo/:id', videoController.streamVideo);

module.exports = router;