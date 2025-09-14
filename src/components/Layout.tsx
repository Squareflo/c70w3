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

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  // Get current page from window.location.pathname
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isSignInPage = currentPath === "/sign-in.html" || currentPath === "/sign-in";
  
  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about.html" },
    { label: "Contact", path: "/contact.html" }
  ];

  return (
    <div className="bg-white pt-4 pr-8 pb-4 pl-8">
      <nav className="w-full">
        <div className="w-full justify-between mt-auto mr-auto mb-auto ml-auto md:flex-row flex max-w-screen-2xl">
          <div className="justify-center items-center mb-2 md:m-0 flex flex-row">
            <a href="/" className="flex items-center">
              <img 
                alt="ChowLocal" 
                src={getLogoUrl('medium')}
                className="w-12 md:w-16 h-auto object-contain" 
              />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="bg-white justify-end items-center md:flex flex flex-row flex-wrap hidden">
            {navigationItems.map((item) => (
              <a 
                key={item.label}
                href={item.path} 
                className="text-gray-600 text-center mr-6 font-medium text-base font-raleway hover:text-gray-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a 
              href={isSignInPage ? "/sign-up.html" : "/sign-in.html"} 
              className="h-9 px-6 text-white bg-blue-700 hover:bg-blue-900 hover:border-blue-900 border-2 flex items-center justify-center text-center border-blue-700 rounded-lg text-sm font-normal transition-colors"
            >
              {isSignInPage ? "Sign Up" : "Sign In"}
            </a>
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
                      <a 
                        href={item.path}
                        className="text-gray-600 hover:text-gray-900 font-medium text-lg py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {item.label}
                      </a>
                    </SheetClose>
                  ))}
                  <div className="pt-4 border-t">
                    <SheetClose asChild>
                      <a 
                        href={isSignInPage ? "/sign-up.html" : "/sign-in.html"} 
                        className="w-full h-12 text-white bg-blue-600 hover:bg-blue-700 border-2 flex items-center justify-center text-center border-blue-600 rounded-lg text-base font-medium transition-colors"
                      >
                        {isSignInPage ? "Sign Up" : "Sign In"}
                      </a>
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

// Layout component wrapper
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
    </div>
  );
};
