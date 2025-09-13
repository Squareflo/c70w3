import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { getLogoUrl } from "@/lib/cloudinaryUtils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [logoError, setLogoError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isSignInPage = location.pathname === "/sign-in";

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
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