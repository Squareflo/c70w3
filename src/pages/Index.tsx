import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";

const Index = () => {
  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Welcome to ChowLocal
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover amazing local restaurants and connect with your community through food.
          </p>
          <div className="space-x-4">
            <Link 
              to="/sign-up" 
              className="bg-blue-700 hover:bg-blue-900 text-white px-8 py-3 rounded-lg text-lg font-medium inline-block transition-colors"
            >
              Get Started
            </Link>
            <Link 
              to="/sign-in" 
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium inline-block transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;