import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SidebarNav } from '@/components/SidebarNav';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  avatarUrl?: string;
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
      if (!user?.id) return;
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
        return;
      }

      if (profileData) {
        setProfile({
          id: profileData.id,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: profileData.email || '',
          phoneNumber: profileData.phone_number || '',
          city: profileData.city || '',
          avatarUrl: profileData.avatar_url || '',
        });
      } else {
        console.log('No profile found');
        toast({
          title: "Error",
          description: "Profile not found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
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
          {/* Sidebar */}
          <SidebarNav profile={profile} onSignOut={handleSignOut} />

          {/* Main Content */}
          <div className="mx-auto flex-col container flex max-w-7xl bg-gray-100 border-transparent shadow-gray-400/100">
            {/* Header */}
            <div className="mx-0 mb-0 mt-6 w-full px-6 lg:mx-0 lg:max-w-none py-0 max-w-3xl">
              <div className="mb-6 mt-4">
                <p className="text-xl font-medium lg:text-2xl">My Dashboard</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="w-full sm:grid-cols-2 lg:grid-cols-4 pt-4 pb-4 pr-4 pl-4 mx-auto grid grid-cols-1 gap-6 max-w-7xl">
              <div className="w-full text-left rounded-xl pt-6 pb-6 pr-6 pl-6 relative border border-gray-300 bg-white shadow-sm border-0">
                <div className="w-full justify-between items-start flex-row flex">
                  <p>Orders</p>
                </div>
                <div className="w-full justify-start items-baseline flex-row flex space-x-3">
                  <p className="font-semibold text-3xl">13</p>
                </div>
              </div>
              <div className="w-full text-left rounded-xl pt-6 pb-6 pr-6 pl-6 relative border border-gray-300 bg-white shadow-sm border-0">
                <div className="w-full justify-between items-start flex-row flex">
                  <p>Deliveries</p>
                </div>
                <div className="w-full justify-start items-baseline flex-row flex space-x-3">
                  <p className="font-semibold text-3xl">8</p>
                </div>
              </div>
              <div className="w-full text-left rounded-xl pt-6 pb-6 pr-6 pl-6 relative border border-gray-300 bg-white shadow-sm border-0">
                <div className="w-full justify-between items-start flex-row flex">
                  <p>Bookings</p>
                </div>
                <div className="w-full justify-start items-baseline flex-row flex space-x-3">
                  <p className="font-semibold text-3xl">2</p>
                </div>
              </div>
              <div className="w-full text-left rounded-xl pt-6 pb-6 pr-6 pl-6 relative border border-gray-300 bg-white shadow-sm border-0">
                <div className="w-full justify-between items-start flex-row flex">
                  <p>Reviews</p>
                </div>
                <div className="w-full justify-start items-baseline flex-row flex space-x-3">
                  <p className="font-semibold text-3xl">6</p>
                </div>
              </div>
            </div>

            {/* Tables Section */}
            <div className="w-full bg-gray-100 pt-0 pb-20 2xl:py-40 relative">
              <div className="pr-4 pl-4 mr-auto ml-auto">
                {/* Latest Orders Table */}
                <div className="mt-3 mr-auto mb-3 ml-auto max-w-5xl">
                  <div className="mt-8 items-center justify-between mb-4 flex">
                    <div className="max-w-md">
                      <p className="text-lg font-bold text-gray-900 mb-0">Latest Orders</p>
                    </div>
                    <div></div>
                  </div>
                  <div className="w-full bg-white rounded-xl shadow-sm overflow-x-scroll border-0">
                    <table className="w-full mt-3 bg-white table-auto">
                      <thead className="bg-gray-100 rounded-t-lg">
                        <tr className="text-xs text-left text-gray-800">
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell font-medium text-sm items-center bg-white flex text-start">
                            <span className="ml-2 text-sm font-medium text-slate-500">Order #</span>
                          </th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell text-left text-sm font-medium bg-white text-slate-400">Date</th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell text-sm text-left font-medium bg-white text-slate-400">Status</th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell text-left text-sm font-medium bg-white text-slate-400">Store</th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell text-sm text-left font-medium bg-white text-slate-400">Total</th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell bg-white"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-sm border-b border-gray-100">
                          <td className="py-3 px-2 items-center font-medium pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell flex">
                            <div className="items-center flex">
                              <p className="pl-2 text-sm font-medium text-gray-900 whitespace-nowrap">#567829</p>
                            </div>
                          </td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">05 May, 2022</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell justify-center whitespace-nowrap flex">Accepted</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">Jimmy's Pizzeria...</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">$89.00</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-500 sm:px-6 lg:table-cell whitespace-nowrap">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                          </td>
                        </tr>
                        <tr className="text-sm border-b border-gray-100">
                          <td className="py-3 px-2 items-center font-medium pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell flex">
                            <div className="items-center flex">
                              <p className="pl-2 text-sm font-medium text-gray-900 whitespace-nowrap">#567830</p>
                            </div>
                          </td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">06 May, 2022</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell justify-center whitespace-nowrap flex">En Route</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">Joe's Burgers...</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">$65.00</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-500 sm:px-6 lg:table-cell whitespace-nowrap">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                          </td>
                        </tr>
                        <tr className="text-sm border-b border-gray-100">
                          <td className="py-3 px-2 items-center font-medium pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell flex">
                            <div className="items-center flex">
                              <p className="pl-2 text-sm font-medium text-gray-900 whitespace-nowrap">#567831</p>
                            </div>
                          </td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">07 May, 2022</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell justify-center whitespace-nowrap flex">Delivered</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">Tasty Tacos...</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">$42.50</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-500 sm:px-6 lg:table-cell whitespace-nowrap">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Latest Bookings Table */}
                <div className="mt-3 mr-auto mb-3 ml-auto max-w-5xl">
                  <div className="mt-8 items-center justify-between mb-4 flex">
                    <div className="max-w-md">
                      <p className="text-lg font-bold text-gray-900 mb-0">Latest Bookings</p>
                    </div>
                    <div></div>
                  </div>
                  <div className="w-full bg-white rounded-xl shadow-sm overflow-x-scroll border-0">
                    <table className="w-full mt-3 bg-white table-auto">
                      <thead className="bg-gray-100 rounded-t-lg">
                        <tr className="text-xs text-left text-gray-800">
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell font-medium text-sm items-center bg-white flex text-start">
                            <span className="ml-2 text-sm font-medium text-slate-500">Booking #</span>
                          </th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell text-left text-sm font-medium bg-white text-slate-400">Date</th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell text-sm text-left font-medium bg-white text-slate-400">Status</th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell text-left text-sm font-medium bg-white text-slate-400">Store</th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell text-sm text-left font-medium bg-white text-slate-400"># Guests</th>
                          <th className="pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell bg-white"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-sm border-b border-gray-100">
                          <td className="py-3 px-2 items-center font-medium pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell flex">
                            <div className="items-center flex">
                              <p className="pl-2 text-sm font-medium text-gray-900 whitespace-nowrap">#BK001</p>
                            </div>
                          </td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">10 May, 2022</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell justify-center whitespace-nowrap flex">Confirmed</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">Fine Dining...</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">4</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-500 sm:px-6 lg:table-cell whitespace-nowrap">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                          </td>
                        </tr>
                        <tr className="text-sm border-b border-gray-100">
                          <td className="py-3 px-2 items-center font-medium pt-4 pr-4 pb-4 pl-4 sm:px-6 lg:table-cell flex">
                            <div className="items-center flex">
                              <p className="pl-2 text-sm font-medium text-gray-900 whitespace-nowrap">#BK002</p>
                            </div>
                          </td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">12 May, 2022</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell justify-center whitespace-nowrap flex">Pending</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-medium text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">Cozy Cafe...</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-900 sm:px-6 lg:table-cell whitespace-nowrap">2</td>
                          <td className="pt-4 pr-4 pb-4 pl-4 text-sm font-bold text-gray-500 sm:px-6 lg:table-cell whitespace-nowrap">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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