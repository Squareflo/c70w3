import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

// Helper function to generate optimized image URLs
export const getOptimizedImageUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
}) => {
  const baseUrl = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  const transformations = [];
  
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);
  
  // Add default optimizations
  transformations.push('f_auto', 'q_auto');
  
  const transformationString = transformations.length > 0 ? transformations.join(',') + '/' : '';
  
  return `${baseUrl}/${transformationString}${publicId}`;
};

// Helper function for responsive image URLs
export const getResponsiveImageUrl = (publicId: string, sizes: number[] = [320, 480, 768, 1024, 1200]) => {
  return sizes.map(size => ({
    url: getOptimizedImageUrl(publicId, { width: size }),
    width: size
  }));
};

// Logo specific helper
export const getLogoUrl = (size: 'small' | 'medium' | 'large' = 'medium') => {
  const sizeMap = {
    small: { width: 48, height: 48 },
    medium: { width: 64, height: 64 },
    large: { width: 96, height: 96 }
  };
  
  const { width, height } = sizeMap[size];
  
  // Uses the chowlocal-logo public ID from Cloudinary
  return getOptimizedImageUrl('chowlocal-logo', { 
    width, 
    height, 
    quality: 'auto',
    format: 'auto'
  });
};