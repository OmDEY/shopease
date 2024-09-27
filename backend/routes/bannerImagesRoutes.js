const express = require('express');
const router = express.Router();
const { uploadImages, getBannerImages } = require('../controller/bannerImagesController');
const multer = require('multer');


const storage = multer.memoryStorage(); // Store files in memory buffer temporarily
const upload = multer({ storage: storage });

// Route to upload multiple images and store the URLs in MongoDB
router.post('/upload', upload.array('image'), uploadImages);
router.get('/fetch', getBannerImages);

module.exports = router;
