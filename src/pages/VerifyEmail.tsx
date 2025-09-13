import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="mx-auto bg-white items-center justify-center flex min-h-screen max-w-screen-2xl p-4 relative isolate">
        <div className="w-full p-8 max-w-lg relative isolate">
          <p className="text-center text-4xl font-bold tracking-tight mb-4">Email verification is no longer needed</p>
          <p className="text-center text-slate-600 mb-6">
            Your account is created automatically. You can sign in directly.
          </p>
          <button
            onClick={() => navigate('/sign-in')}
            className="p-3 w-full bg-black text-white rounded-lg hover:bg-gray-800 font-raleway"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;