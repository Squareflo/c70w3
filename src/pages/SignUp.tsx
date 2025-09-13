import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CityAutocomplete } from '@/components/ui/city-autocomplete';
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    email: '',
    phoneNumber: '',
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
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.city,
        formData.phoneNumber
      );

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Send verification email
        const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: { 
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`
          }
        });

        if (emailError) {
          console.error('Error sending verification email:', emailError);
          toast({
            title: "Account Created",
            description: "Account created but verification email failed to send. Please try signing in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Account created! Please check your email for verification code.",
          });
        }
        
        // Navigate to verification page
        navigate('/verify-email', { 
          state: { 
            email: formData.email 
          } 
        });
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
      <main className="w-full bg-white text-black relative isolate">
        <span className="h-full w-full items-center justify-center inline-flex absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(100%_100%_at_bottom_left,white,transparent)]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <pattern id="signup-pattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(12) rotate(0)">
                <rect x="0" y="0" width="100%" height="100%" fill="hsla(0,0%,100%,1)" />
                <path strokeWidth="0.1px" d="M15 5h10v30H15zM35-5V5H5V-5zM35 35v10H5V35zM35-15h10v30H35zM55 15v10H25V15zM15 15v10h-30V15zM35 25h10v30H35zM-5 25H5v30H-5zM-5-15H5v30H-5z" stroke="currentColor" className="stroke-gray-900" fill="none" />
              </pattern>
            </defs>
            <rect width="800%" height="800%" transform="translate(0,0)" fill="url(#signup-pattern)" />
          </svg>
        </span>
        <div className="mx-auto bg-white items-center justify-center flex min-h-screen max-w-screen-2xl p-4 relative isolate">
          <svg className="w-[468px] h-[788px] sm:left-10 lg:left-20 absolute top-10 left-0 -z-10 transform-gpu overflow-hidden blur-2xl" viewBox="0 0 468 788" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="44.5105" cy="378.637" r="156.383" fill="#4A3AFF" />
            <circle cx="119.803" cy="529.24" r="156.383" fill="#702DFF" />
            <circle cx="173.364" cy="372.857" r="156.383" fill="#2D5BFF" />
            <g filter="url(#filter0_b_signup)">
              <circle cx="73.5409" cy="394.049" r="393.819" fill="white" fillOpacity="0.79" />
            </g>
            <defs>
              <filter id="filter0_b_signup" x="-460.404" y="-139.896" width="1067.89" height="1067.89" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="70.063" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_signup" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_signup" result="shape" />
              </filter>
            </defs>
          </svg>
          <div className="w-full p-8 max-w-lg relative isolate">
            <p className="text-center text-4xl font-bold tracking-tight mb-10">Sign Up</p>
            <form className="mt-10" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white"
                  required
                />
                <CityAutocomplete
                  value={formData.city}
                  onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                  placeholder="City"
                  className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Mobile Phone #"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/sign-in')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SignUp;