import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { getLogoUrl } from "@/lib/cloudinary";
import { getLogoUrl } from "@/lib/cloudinaryUtils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

  const checkCurrentLogo = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (cloudName) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/w_auto,q_auto,f_auto/chowlocal-logo`;
    }
    return null;
  };

  const isCloudinaryConfigured = () => {
    return !!(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  };

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
            
            {isCloudinaryConfigured() ? (
              <div className="mb-6">
                <CloudinaryImageUpload
                  onUploadSuccess={handleUploadSuccess}
                  folder="logos"
                  maxSizeMB={2}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4"
                />
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Cloudinary Not Configured</h3>
                <p className="text-sm text-yellow-700">
                  To enable logo uploads, you need to set up your Cloudinary environment variables:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                  <li>VITE_CLOUDINARY_CLOUD_NAME</li>
                  <li>VITE_CLOUDINARY_UPLOAD_PRESET</li>
                </ul>
              </div>
            )}

            <div className="text-sm text-gray-600 mb-4">
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Debug Info:</h3>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Cloudinary Cloud Name:</strong> {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'Not set'}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Upload Preset:</strong> {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Not set'}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Configuration Status:</strong> {isCloudinaryConfigured() ? '✅ Configured' : '❌ Missing configuration'}
              </p>
              {checkCurrentLogo() && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Current logo URL:</p>
    <div className="bg-white pt-4 pr-8 pb-4 pl-8">
      <nav className="w-full">
        <div className="w-full justify-between mt-auto mr-auto mb-auto ml-auto md:flex-row flex max-w-screen-2xl">
          <div className="justify-center items-center mb-2 md:m-0 flex flex-row">
            {logoError ? (
              <div className="w-12 md:w-16 h-12 md:h-16 flex items-center justify-center bg-red-600 text-white font-bold rounded">
                Logo
              </div>
            ) : (
              <img 
                alt="ChowLocal" 
                src={getLogoUrl('medium')}
                className="w-12 md:w-16" 
                onError={() => {
                  console.error('Logo failed to load from Cloudinary');
                  setLogoError(true);
                }}
              />
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="bg-white justify-end items-center md:flex flex flex-row flex-wrap hidden">
            {navigationItems.map((item) => (
              <Link 
                key={item.label}
                to={item.path} 
                className="text-gray-600 text-center mr-6 font-medium text-base font-raleway"
              >
                {item.label}
              </Link>
            ))}
            <Link 
              to={isSignInPage ? "/sign-up" : "/sign-in"} 
              className="h-9 w-24 text-white bg-blue-700 hover:bg-blue-900 hover:border-blue-900 border-2 flex items-center justify-center text-center border-blue-700 rounded-lg text-sm font-normal"
            >
              {isSignInPage ? "Sign Up" : "Sign In"}
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Menu className="h-6 w-6 text-gray-600" />
                  <span className="sr-only">Open menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-80">
                <SheetHeader>
                  <SheetTitle className="text-left opacity-0">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  {navigationItems.map((item) => (
                    <SheetClose key={item.label} asChild>
                      <Link 
                        to={item.path}
                        className="text-gray-600 hover:text-gray-900 font-medium text-lg py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="pt-4 border-t">
                    <SheetClose asChild>
                      <Link 
                        to={isSignInPage ? "/sign-up" : "/sign-in"} 
                        className="w-full h-12 text-white bg-red-600 hover:bg-red-700 border-2 flex items-center justify-center text-center border-red-600 rounded-lg text-base font-medium transition-colors"
                      >
                        {isSignInPage ? "Sign Up" : "Sign In"}
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}