import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileAtCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath);

    // file uploaded successfully
    console.log('file uploaded successfully: ', response);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error(error);
    return null;
  }
};

export { uploadFileAtCloudinary };
