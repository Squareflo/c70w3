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

// Create a reliable SVG fallback logo
export const createFallbackLogo = (width: number = 64, height: number = 64) => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#dc2626" rx="8"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.3)}" font-weight="bold">
        LOGO
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
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
