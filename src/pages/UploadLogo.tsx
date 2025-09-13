import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { CloudinaryImageUpload } from '@/components/CloudinaryImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { isCloudinaryConfigured, getLogoUrl, createFallbackLogo } from '@/lib/cloudinaryUtils';
import { useToast } from '@/hooks/use-toast';

const UploadLogo = () => {
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>(getLogoUrl('large'));
  const [logoError, setLogoError] = useState(false);
  const { toast } = useToast();

  const handleUploadSuccess = (imageUrl: string, publicId: string) => {
    setCurrentLogoUrl(imageUrl);
    setLogoError(false);
    toast({
      title: "Logo Updated",
      description: "Your logo has been successfully uploaded and updated.",
    });
  };

  const handleLogoError = () => {
    setLogoError(true);
    console.log('Logo failed to load, using fallback');
  };

  const resetToFallback = () => {
    setCurrentLogoUrl(createFallbackLogo(128, 128));
    setLogoError(false);
    toast({
      title: "Logo Reset",
      description: "Logo has been reset to the default fallback.",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Logo</h1>
            <p className="text-gray-600">
              Upload a new logo for your application. The logo will be automatically optimized and resized.
            </p>
          </div>

          {!isCloudinaryConfigured() && (
            <Alert className="mb-6">
              <AlertDescription>
                <strong>Cloudinary not configured:</strong> To enable logo uploads, you need to configure Cloudinary with your cloud name and upload preset in the cloudinaryUtils.ts file.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Logo Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Current Logo</CardTitle>
                <CardDescription>This is how your logo currently appears</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  {logoError ? (
                    <div className="w-32 h-32 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">LOGO</span>
                    </div>
                  ) : (
                    <img
                      src={currentLogoUrl}
                      alt="Current Logo"
                      className="max-w-32 max-h-32 object-contain"
                      onError={handleLogoError}
                    />
                  )}
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">Preview in different sizes:</p>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={logoError ? createFallbackLogo(24, 24) : getLogoUrl('small')}
                      alt="Small logo"
                      className="w-6 h-6"
                      onError={() => {}}
                    />
                    <img
                      src={logoError ? createFallbackLogo(48, 48) : getLogoUrl('medium')}
                      alt="Medium logo"
                      className="w-12 h-12"
                      onError={() => {}}
                    />
                    <img
                      src={logoError ? createFallbackLogo(64, 64) : getLogoUrl('large')}
                      alt="Large logo"
                      className="w-16 h-16"
                      onError={() => {}}
                    />
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={resetToFallback}
                  className="mt-4"
                >
                  Reset to Default
                </Button>
              </CardContent>
            </Card>

            {/* Upload New Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Upload New Logo</CardTitle>
                <CardDescription>
                  Upload a new logo image. Supported formats: PNG, JPG, WebP (max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isCloudinaryConfigured() ? (
                  <CloudinaryImageUpload
                    onUploadSuccess={handleUploadSuccess}
                    folder="chowlocal"
                    maxSizeMB={5}
                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <div className="text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">Cloudinary Not Configured</p>
                      <p className="text-sm">
                        Please configure Cloudinary settings to enable logo uploads.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Usage Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Logo Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Recommended Specifications</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Format: PNG with transparency preferred</li>
                    <li>• Minimum size: 128x128 pixels</li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Square aspect ratio works best</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Where Your Logo Appears</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Navigation header (64x64px)</li>
                    <li>• Mobile menu (48x48px)</li>
                    <li>• Email signatures (32x32px)</li>
                    <li>• Browser tab icon (16x16px)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UploadLogo;