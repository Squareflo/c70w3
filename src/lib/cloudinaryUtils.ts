export const getOptimizedImageUrl = (
  cloudName: string,
  publicId: string,
  transformations: string = 'w_auto,q_auto,f_auto'
): string => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

export const getLogoUrl = (size: 'small' | 'medium' | 'large' = 'medium'): string | null => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    return null;
  }
  
  const sizeMap = {
    small: 'w_64,h_64',
    medium: 'w_128,h_128', 
    large: 'w_256,h_256'
  };
  
  const transformation = `${sizeMap[size]},q_auto,f_auto`;
  return getOptimizedImageUrl(cloudName, 'chowlocal-logo', transformation);
};