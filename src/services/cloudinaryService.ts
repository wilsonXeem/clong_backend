import cloudinary from '../config/cloudinary.js';

interface CloudinaryResult {
  url: string;
  public_id: string;
  [key: string]: any;
}

export const uploadImage = async (buffer: Buffer, folder?: string): Promise<CloudinaryResult> => {
  return new Promise((resolve, reject) => {
    const options: any = { resource_type: 'image' };
    if (folder) {
      options.folder = folder;
    }
    
    cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryResult);
      }
    ).end(buffer);
  });
};

export default cloudinary;