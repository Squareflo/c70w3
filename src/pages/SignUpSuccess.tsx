import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/ui/navbar';

const SignUpSuccess = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="mx-auto bg-white items-center justify-center flex min-h-screen max-w-screen-2xl p-4 relative isolate">
        <svg className="w-[468px] h-[788px] sm:left-10 lg:left-20 absolute top-10 left-0 -z-10 transform-gpu overflow-hidden blur-2xl" viewBox="0 0 468 788" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="44.5105" cy="378.637" r="156.383" fill="#4A3AFF" />
          <circle cx="119.803" cy="529.24" r="156.383" fill="#702DFF" />
          <circle cx="173.364" cy="372.857" r="156.383" fill="#2D5BFF" />
          <g filter="url(#filter0_b_success)">
            <circle cx="73.5409" cy="394.049" r="393.819" fill="white" fillOpacity="0.79" />
          </g>
          <defs>
            <filter id="filter0_b_success" x="-460.404" y="-139.896" width="1067.89" height="1067.89" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="70.063" />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_success" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_success" result="shape" />
            </filter>
          </defs>
        </svg>
        <div className="w-full p-8 max-w-lg relative isolate text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-4xl font-bold tracking-tight mb-4">Success!</p>
            <p className="text-slate-600 text-lg mb-8">
              Your account has been created successfully. You can now sign in to access your dashboard.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/sign-in')}
              style={{ fontFamily: 'Arial' }}
              className="p-3 w-full bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => navigate('/')}
              className="p-3 w-full border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccess;