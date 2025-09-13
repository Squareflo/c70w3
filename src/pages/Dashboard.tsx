import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  city: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/sign-in');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  return (
    <div>
      <div className="flex-col flex">
        <div className="w-full border-b-2 border-gray-200"></div>
        <div className="bg-gray-50 flex overflow-x-hidden">
          <div className="bg-white md:w-64 md:flex-col lg:flex hidden">
            <div className="h-full pt-5 flex-col flex overflow-y-auto">
              <div className="bg-white w-1/4">
                <div className="bg-white lg:flex md:w-64 md:flex-col hidden">
                  <div className="h-full pt-0 flex-col flex overflow-y-auto">
                    <div className="mt-0 py-3 px-2 mb-4 bg-white border-b border-slate-200">
                      <div className="justify-between items-center flex">
                        <div className="w-fit rounded-full mr-3 relative">
                          <img 
                            alt="User Avatar" 
                            src="https://static01.nyt.com/images/2019/11/08/world/08quebec/08quebec-superJumbo.jpg" 
                            className="object-cover h-10 w-10 rounded-full" 
                          />
                        </div>
                        <div className="mr-auto ml-0">
                          <p className="font-bold text-base">
                            {profile?.first_name} {profile?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{profile?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-col flex">
                      <div className="w-full">
                        <div className="py-1 text-gray-500 text-xs font-semibold px-2">MENU</div>
                        <div className="flex-col flex">
                          <a className="justify-between items-center hover:text-gray-800 hover:bg-gray-50 py-2 px-3 cursor-pointer flex text-gray-500 text-sm">
                            <div className="justify-start items-center flex">
                              <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                              </svg>
                              <div>Dashboard</div>
                            </div>
                          </a>
                          <a className="justify-between items-center hover:text-gray-800 hover:bg-gray-50 py-2 px-3 cursor-pointer flex text-gray-500 text-sm">
                            <div className="justify-start items-center flex">
                              <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              <div>Profile</div>
                            </div>
                          </a>
                          <a className="justify-between items-center hover:text-gray-800 hover:bg-gray-50 py-2 px-3 cursor-pointer flex text-gray-500 text-sm">
                            <div className="justify-start items-center flex">
                              <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <div>Settings</div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full flex-col flex">
            <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome!</h3>
                  <p className="text-gray-600">
                    Hello {profile?.first_name}! Welcome to your dashboard.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Info</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Email:</span> {profile?.email}</p>
                    <p><span className="font-medium">City:</span> {profile?.city}</p>
                    <p><span className="font-medium">Phone:</span> {profile?.phone_number}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      Edit Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      View Activity
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-center py-8">
                    No recent activity to display. Start exploring to see your activity here!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;