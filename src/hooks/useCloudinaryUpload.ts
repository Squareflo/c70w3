import { useState } from 'react';
import { uploadToCloudinary, type CloudinaryResponse } from '@/lib/cloudinaryUtils';

interface UseCloudinaryUploadReturn {
  uploadImage: (file: File, folder?: string) => Promise<CloudinaryResponse>;
  isUploading: boolean;
  error: string | null;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, folder?: string): Promise<CloudinaryResponse> => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadToCloudinary(file, folder);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error
  };
};