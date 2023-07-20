const Jimp = require('jimp');

const imageProcessor = async path => {
  const image = await Jimp.read(path);
  image.resize(250, 250).write(path);
};

module.exports = imageProcessor;
