import { Layout } from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Welcome to ChowLocal
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover amazing local restaurants and connect with your community through food.
          </p>
          <div className="space-x-4">
            <a 
              href="/sign-up.html" 
              className="bg-blue-700 hover:bg-blue-900 text-white px-8 py-3 rounded-lg text-lg font-medium inline-block transition-colors"
            >
              Get Started
            </a>
            <a 
              href="/sign-in.html" 
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium inline-block transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
