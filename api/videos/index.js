var router = require('express').Router();
var videoController = require('./videos.controller');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
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


router.post('/upload', upload.single('file'), videoController.upload);
router.post('/create', videoController.crate);

module.exports = router;