import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        window.location.href = '/dashboard.html';
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto bg-white items-center justify-center flex min-h-screen max-w-screen-2xl p-4 relative isolate">
        <svg className="w-[468px] h-[788px] sm:left-10 lg:left-20 absolute top-10 left-0 -z-10 transform-gpu overflow-hidden blur-2xl" viewBox="0 0 468 788" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="44.5105" cy="378.637" r="156.383" fill="#4A3AFF" />
          <circle cx="119.803" cy="529.24" r="156.383" fill="#702DFF" />
          <circle cx="173.364" cy="372.857" r="156.383" fill="#2D5BFF" />
          <g filter="url(#filter0_b_signin)">
            <circle cx="73.5409" cy="394.049" r="393.819" fill="white" fillOpacity="0.79" />
          </g>
          <defs>
            <filter id="filter0_b_signin" x="-460.404" y="-139.896" width="1067.89" height="1067.89" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="70.063" />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_signin" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_signin" result="shape" />
            </filter>
          </defs>
        </svg>
        <div className="w-full p-8 max-w-lg relative isolate">
          <p className="text-center text-4xl font-bold tracking-tight mb-10">Sign In</p>
          <form className="mt-10" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="p-3 w-full bg-black text-white rounded-lg mt-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-raleway"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a
                href="/sign-up.html"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
