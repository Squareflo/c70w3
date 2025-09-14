import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { CloudinaryImageUpload } from '@/components/CloudinaryImageUpload';
import { useToast } from '@/hooks/use-toast';

const UploadLogo = () => {
  const { toast } = useToast();
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>('');

  const handleLogoUpload = (imageUrl: string, publicId: string) => {
    setUploadedLogoUrl(imageUrl);
    toast({
      title: "Logo Uploaded Successfully",
      description: "Your restaurant logo has been uploaded and is ready to use.",
    });
  };

  const handleSaveLogo = () => {
    if (!uploadedLogoUrl) {
      toast({
        title: "No Logo Selected",
        description: "Please upload a logo before saving.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save the logo URL to your database
    toast({
      title: "Logo Saved",
      description: "Your restaurant logo has been saved successfully.",
    });
    
    // Redirect to dashboard or wherever appropriate
    window.location.href = '/dashboard.html';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Restaurant Logo</h1>
              <p className="text-gray-600">
                Add your restaurant's logo to help customers recognize your brand. 
                This will appear on your restaurant profile and in search results.
              </p>
            </div>

            <div className="mb-8">
              <CloudinaryImageUpload
                onUploadSuccess={handleLogoUpload}
                folder="restaurant-logos"
                maxSizeMB={5}
                acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                className="mb-6"
              />
            </div>

            {uploadedLogoUrl && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Logo Preview</h3>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <img
                    src={uploadedLogoUrl}
                    alt="Restaurant Logo Preview"
                    className="max-w-xs max-h-32 mx-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => window.location.href = '/dashboard.html'}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleSaveLogo}
                disabled={!uploadedLogoUrl}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Logo
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadLogo;
