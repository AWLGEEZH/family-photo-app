const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: 'family-photos',
      transformation: resourceType === 'video' ? [
        { width: 1280, height: 720, crop: 'limit', quality: 'auto' }
      ] : [
        { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload to cloud storage');
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete from cloud storage');
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};