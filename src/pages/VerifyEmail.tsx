import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  // Get form data from navigation state
  const formData = location.state?.formData;

  useEffect(() => {
    // If no form data, redirect back to sign up
    if (!formData) {
      navigate('/sign-up');
    }
  }, [formData, navigate]);

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First verify the code
      const { error: verifyError } = await supabase.functions.invoke('verify-email-code', {
        body: { 
          email: formData.email,
          code: verificationCode
        }
      });

      if (verifyError) {
        toast({
          title: "Invalid Code",
          description: "The verification code is invalid or expired. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Code is valid, now create the account
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.city,
        formData.phoneNumber
      );

      if (signUpError) {
        toast({
          title: "Account Creation Failed",
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Your email has been verified and account created successfully.",
      });

      // Navigate to success page
      navigate('/signup-success');

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

  const handleResendCode = async () => {
    setResendLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to resend verification code. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  if (!formData) {
    return null; // Will redirect
  }

  return (
    <Layout>
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
          <p className="text-center text-slate-600 mb-6">
            We just sent an email to <strong>{formData.email}</strong> with a verification code. 
            Enter the code below to complete your registration.
          </p>
          <form className="mt-10" onSubmit={handleVerificationSubmit}>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="border border-gray-200 p-3 focus:ring-1 focus:ring-gray-600 focus:outline-none border-2 w-full rounded-lg bg-white text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="p-3 w-full bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-raleway"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-6 space-y-4">
            <p className="text-gray-600">
              Didn't get the code?{' '}
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend It'}
              </button>
            </p>
            <p className="text-gray-600">
              Wrong Email Address?{' '}
              <button
                onClick={() => navigate('/sign-up')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Start Over
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
