import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CloudinaryImageUploadProps {
  onUploadSuccess?: (imageUrl: string, publicId: string) => void;
  folder?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

export const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  onUploadSuccess,
  folder = 'chowlocal',
  maxSizeMB = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
}) => {
  const { uploadImage, isUploading, error } = useCloudinaryUpload();
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      
      if (!file) return;

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        toast({
          title: "File too large",
          description: `File size must be less than ${maxSizeMB}MB`,
          variant: "destructive",
        });
        return;
      }

      try {
        const result = await uploadImage(file, folder);
        
        toast({
          title: "Upload successful",
          description: "Your image has been uploaded successfully.",
        });

        onUploadSuccess?.(result.secure_url, result.public_id);
      } catch (err) {
        toast({
          title: "Upload failed",
          description: error || "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    },
    [uploadImage, onUploadSuccess, folder, maxSizeMB, error, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200 hover:border-gray-400
          ${isDragActive ? 'border-blue-400 bg-blue-50' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-600">Drop the image here...</p>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600 mb-2">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Max size: {maxSizeMB}MB | Formats: {acceptedFileTypes.map(type => type.split('/')[1]).join(', ')}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};