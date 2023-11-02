import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadFiles = async (file: string, folder = 'temp') => {

  const resource_type: "auto" = 'auto'

  const config = {
    folder,
    width: 400,
    use_filename: true,
    unique_filename: false,
    resource_type,
  }

  try {
    const result = await cloudinary.uploader.upload(file, config);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};
