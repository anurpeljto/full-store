const path = require('path')
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadProductImage = async(req, res) => {
    const imagePaths = [];
    const files = req.files.image;

    if (Array.isArray(files)) {
        for (const file of files) {
            const result = await cloudinary.uploader.upload(
                file.tempFilePath, {
                    use_filename: true,
                    folder: 'file-upload',
                }
            );
            imagePaths.push({ src: result.secure_url }); // Store as { src: 'url' }
            fs.unlinkSync(file.tempFilePath);
        }
    } else {
        const result = await cloudinary.uploader.upload(
            files.tempFilePath, {
                use_filename: true,
                folder: 'file-upload',
            }
        );
        imagePaths.push({ src: result.secure_url });
        fs.unlinkSync(files.tempFilePath);
    }
    return res.status(StatusCodes.OK).json({image: imagePaths});

}

module.exports = uploadProductImage;