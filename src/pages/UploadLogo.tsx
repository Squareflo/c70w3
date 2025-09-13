import React, { useState } from 'react';
import { CloudinaryImageUpload } from '@/components/CloudinaryImageUpload';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';

const UploadLogo = () => {
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState<string>('');

  const handleUploadSuccess = (imageUrl: string, publicId: string) => {
    setLogoUrl(imageUrl);
    toast({
      title: "Logo uploaded successfully!",
      description: `Logo uploaded with public ID: ${publicId}`,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Upload ChowLocal Logo
            </h1>
            
            <div className="mb-6">
              <CloudinaryImageUpload
                onUploadSuccess={handleUploadSuccess}
                folder="logos"
                maxSizeMB={2}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4"
              />
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Upload your logo image above</li>
                <li>Make sure to name it "chowlocal-logo" when uploading</li>
                <li>Once uploaded, the logo will automatically be used throughout the site</li>
              </ol>
            </div>

            {logoUrl && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Preview:</h3>
                <img src={logoUrl} alt="Uploaded logo" className="h-16 w-auto mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadLogo;