import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/ui/navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeSignUp } = useAuth() as any; // Type assertion for completeSignUp
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const email = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await completeSignUp(email, code);

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email Verified",
          description: "Your account has been created successfully!",
        });
        navigate('/signup-success');
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
    <div>
      <Navbar />
      <div className="mx-auto bg-white items-center justify-center flex min-h-screen max-w-screen-2xl p-4 relative isolate">
        <svg className="w-[468px] h-[788px] sm:left-10 lg:left-20 absolute top-10 left-0 -z-10 transform-gpu overflow-hidden blur-2xl" viewBox="0 0 468 788" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="44.5105" cy="378.637" r="156.383" fill="#4A3AFF" />
          <circle cx="119.803" cy="529.24" r="156.383" fill="#702DFF" />
          <circle cx="173.364" cy="372.857" r="156.383" fill="#2D5BFF" />
          <g filter="url(#filter0_b_verify)">
            <circle cx="73.5409" cy="394.049" r="393.819" fill="white" fillOpacity="0.79" />
          </g>
          <defs>
            <filter id="filter0_b_verify" x="-460.404" y="-139.896" width="1067.89" height="1067.89" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="70.063" />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_verify" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_verify" result="shape" />
            </filter>
          </defs>
        </svg>
        <div className="w-full p-8 max-w-lg relative isolate">
          <p className="text-center text-4xl font-bold tracking-tight mb-4">Verify Email</p>
          <p className="text-center text-slate-600 mb-3">
            We just sent an email to {email}, with a verification code. Enter the code below.
          </p>
          <form className="mt-10" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white text-center text-2xl tracking-wider"
                maxLength={6}
                required
              />
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="p-3 w-full bg-black text-white rounded-lg mt-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-raleway"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Didn't receive the code?{' '}
              <button
                onClick={() => navigate('/sign-up')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Go back to Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;