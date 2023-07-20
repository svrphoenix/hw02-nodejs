const multer = require('multer');
const path = require('path');
const { TEMP } = require('../constants/path');

const tmpPath = path.join(process.cwd(), TEMP);

const storage = multer.diskStorage({
  destination: tmpPath,
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
