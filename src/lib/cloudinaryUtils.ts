// Cloudinary configuration and utility functions
const CLOUDINARY_CLOUD_NAME = 'chowlocal';
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset'; // You'll need to set this up in Cloudinary

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

// Generate logo URL - now points to your actual logo
export const getLogoUrl = (size: 'small' | 'medium' | 'large' = 'medium') => {
  // Just return the basic URL that works for now
  return `https://res.cloudinary.com/chowlocal/image/upload/chowlocal-logo`;
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (file: File, folder: string = 'chowlocal'): Promise<CloudinaryResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Cloudinary upload failed:', response.status, errorData);
    throw new Error(`Upload failed: ${response.status} - ${errorData}`);
  }

  return response.json();
};

// Check if Cloudinary is configured
export const isCloudinaryConfigured = () => {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET !== 'unsigned_preset');
};
