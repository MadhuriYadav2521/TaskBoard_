// cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Dynamic storage with custom resource type
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = 'auto'; // handles images, raw, video
    const ext = file.originalname.split('.').pop();

    if (['pdf', 'docx', 'txt'].includes(ext)) {
      resourceType = 'raw';
    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
      resourceType = 'image';
    }

    return {
      folder: 'uploads',
      resource_type: resourceType,
      public_id: Date.now() + '-' + file.originalname.split('.')[0],
    };
  },
});


export { cloudinary, storage };
