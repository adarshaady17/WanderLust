const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true 
});

// this is from npm cloudinary, only provide the folder name
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust_DEV",
      allowedFormats: ["png", "jpg", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
});

module.exports = {
    cloudinary,
    storage,
}; 