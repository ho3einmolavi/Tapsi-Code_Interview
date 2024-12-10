const sharp = require('sharp');
const fs = require('fs');

const webpFilePath = 'Frame.webp'; // Replace with the path to your WebP image
const jpgFilePath = 'output_image.jpg'; // Replace with the desired output file path

// Use sharp to read the WebP image and convert it to JPG
sharp(webpFilePath)
  .toFile(jpgFilePath, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`WebP image converted to JPG: ${jpgFilePath}`);
    }
  });
