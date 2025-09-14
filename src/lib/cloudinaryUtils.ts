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

// Generate logo URL - fixed to work with your Cloudinary setup
export const getLogoUrl = (size: 'small' | 'medium' | 'large' = 'medium') => {
  const dimensions = {
    small: { w: 64 },
    medium: { w: 64 },
    large: { w: 128 }
  };

  const { w } = dimensions[size];
  
  // Removed h_auto which was causing issues
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${w},q_auto,f_auto/chowlocal-logo`;
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
