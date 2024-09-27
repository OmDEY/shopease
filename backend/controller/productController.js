const Product = require('../models/product');
const cloudinary = require('../config/cloudinary');

const multer = require('multer');
const upload = multer();

const uploadImageToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "auto" }, // Automatically determine the resource type
            (error, result) => {
                if (error) {
                    console.log(error);
                    reject('Cloudinary upload failed');
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(file.buffer); // Use .end() to send the file buffer
    });
};

// Route handler to add product
const addProduct = async (req, res) => {
    try {

        const { title, description, price, category, stock, additionalInfo } = req.body;

        // Handle main images
        const mainImagesFiles = req.files.filter(file => file.fieldname === 'mainImages');

        const mainImagesPromises = mainImagesFiles.map(file => uploadImageToCloudinary(file));
        const mainImages = await Promise.all(mainImagesPromises);

        // Handle additional info and its images
        const additionalImagesPromises = additionalInfo.map(async (info, index) => {
            const additionalImageFiles = req.files.filter(file => file.fieldname === `additionalInfo[${index}][images]`);
            const uploadedAdditionalImagesPromises = additionalImageFiles.map(file => uploadImageToCloudinary(file));
            const uploadedAdditionalImages = await Promise.all(uploadedAdditionalImagesPromises);
            return {
                description: info.description,
                images: uploadedAdditionalImages,
            };
        });

        const additionalImages = await Promise.all(additionalImagesPromises);

        // Create a new product instance
        const product = new Product({
            title,
            description,
            price,
            category,
            stock,
            images: mainImages,
            additionalInfo: additionalImages,
        });

        // Save the product to the database
        await product.save();

        return res.status(201).json({ message: 'Product added successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const products = await Product.find().sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
        return res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProduct = async (req, res) => {
    try {

        console.log(req.files);
        console.log(req.body);

        const { id } = req.params;
        const { title, description, price, category, stock, additionalInfo } = req.body;

        // Handle main images
        const mainImagesFiles = req.files.filter(file => file.fieldname === 'mainImages');
        const mainImagesPromises = mainImagesFiles.map(file => uploadImageToCloudinary(file));
        const mainImages = await Promise.all(mainImagesPromises);

        // Handle additional info and its images
        const additionalImagesPromises = JSON.parse(additionalInfo).map(async (info, index) => {
            const additionalImageFiles = req.files.filter(file => file.fieldname === `additionalInfo[${index}][images]`);
            const uploadedAdditionalImagesPromises = additionalImageFiles.map(file => uploadImageToCloudinary(file));
            const uploadedAdditionalImages = await Promise.all(uploadedAdditionalImagesPromises);
            return {
                description: info.description,
                images: uploadedAdditionalImages,
            };
        });

        const additionalImages = await Promise.all(additionalImagesPromises);

        const product = await Product.findByIdAndUpdate(id, {
            title,
            description,
            price,
            category,
            stock,
            images: mainImages,
            additionalInfo: additionalImages,
        }, { new: true });

        return res.status(200).json({ message: 'Product updated successfully!', product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
};
