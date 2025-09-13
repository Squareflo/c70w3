import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
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
          <div className="bg-white md:w-64 md:flex-col lg:flex hidden">
            <div className="h-full pt-5 flex-col flex overflow-y-auto">
              <div className="bg-white w-1/4">
                <div className="bg-white lg:flex md:w-64 md:flex-col hidden">
                  <div className="h-full pt-0 flex-col flex overflow-y-auto">
                    {/* User Profile Section */}
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
                            {profile?.firstName} {profile?.lastName}
                          </p>
                          <p className="text-sm">{profile?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Menu */}
                    <div className="h-full flex-col flex">
                      <div className="px-4 space-y-4">
                        <nav className="bg-top bg-cover space-y-1">
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="#000000" d="M3 3h8v10H3zm2 2v6h4V5zm8-2h8v6h-8zm2 2v2h4V5zm-2 6h8v10h-8zm2 2v6h4v-6zM3 15h8v6H3zm2 2v2h4v-2z"></path>
                            </svg>
                            <span>Dashboard</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 mr-4 flex-shrink-0">
                              <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h8m-8 4h6m4-9a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12z"></path>
                            </svg>
                            <span>Messages</span>
                            <span className="px-2 py-0.5 items-center font-semibold text-xs ml-auto bg-red-600 text-white rounded-full uppercase border border-transparent inline-flex">15</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="#000000" d="M22 7.82a1.25 1.25 0 0 0 0-.19l-2-5A1 1 0 0 0 19 2H5a1 1 0 0 0-.93.63l-2 5a1.25 1.25 0 0 0 0 .19A.58.58 0 0 0 2 8a4 4 0 0 0 2 3.4V21a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9.56A4 4 0 0 0 22 8a.58.58 0 0 0 0-.18ZM13 20h-2v-4h2Zm5 0h-3v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5H6v-8a4 4 0 0 0 3-1.38a4 4 0 0 0 6 0A4 4 0 0 0 18 12Zm0-10a2 2 0 0 1-2-2a1 1 0 0 0-2 0a2 2 0 0 1-4 0a1 1 0 0 0-2 0a2 2 0 0 1-4 .15L5.68 4h12.64L20 8.15A2 2 0 0 1 18 10Z"></path>
                            </svg>
                            <span>My Stores</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="#000000" d="M9 12H7a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2Zm-1-2h4a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2Zm1 6H7a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2Zm12-4h-3V3a1 1 0 0 0-.5-.87a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0A1 1 0 0 0 2 3v16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1ZM5 20a1 1 0 0 1-1-1V4.73l2 1.14a1.08 1.08 0 0 0 1 0l3-1.72l3 1.72a1.08 1.08 0 0 0 1 0l2-1.14V19a3 3 0 0 0 .18 1Zm15-1a1 1 0 0 1-2 0v-5h2Zm-6.44-2.83a.76.76 0 0 0-.18-.09a.6.6 0 0 0-.19-.06a1 1 0 0 0-.9.27A1.05 1.05 0 0 0 12 17a1 1 0 0 0 .07.38a1.19 1.19 0 0 0 .22.33a1.15 1.15 0 0 0 .33.21a.94.94 0 0 0 .76 0a1.15 1.15 0 0 0 .33-.21A1 1 0 0 0 14 17a1.05 1.05 0 0 0-.29-.71a1.58 1.58 0 0 0-.15-.12Zm.14-3.88a1 1 0 0 0-1.62.33A1 1 0 0 0 13 14a1 1 0 0 0 1-1a1 1 0 0 0-.08-.38a.91.91 0 0 0-.22-.33Z"></path>
                            </svg>
                            <span>Orders</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="#000000" d="M19 7c0-1.1-.9-2-2-2h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v2.65L13.52 14H10v-4c0-.55-.45-1-1-1H6c-2.21 0-4 1.79-4 4v2c0 .55.45 1 1 1h1c0 1.66 1.34 3 3 3s3-1.34 3-3h3.52c.61 0 1.18-.28 1.56-.75l3.48-4.35c.29-.36.44-.8.44-1.25V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z"></path>
                              <path fill="#000000" d="M6 6h3c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1zm13 7c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1z"></path>
                            </svg>
                            <span>Deliveries</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="#000000" d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"></path>
                            </svg>
                            <span>Bookings</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="#000000" d="m10.555 1.764l1.715.572a3.7 3.7 0 0 1 2.53 3.51V8.3h3.869a3 3 0 0 1 2.965 3.456l-1.185 7.7A3 3 0 0 1 17.484 22H2V10.1h4.85l3.705-8.336ZM6.5 12.1H4V20h2.5v-7.9Zm2 7.9h8.984a1 1 0 0 0 .988-.848l1.185-7.7a1 1 0 0 0-.988-1.152H12.8V5.846a1.7 1.7 0 0 0-1.155-1.61L8.5 11.312V20Z"></path>
                            </svg>
                            <span>Reviews</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="#000000" d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.5 7.35 11.76a1 1 0 0 0 1.3 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8Zm0 17.65c-2.13-2-6-6.31-6-9.65a6 6 0 0 1 12 0c0 3.34-3.87 7.66-6 9.65ZM12 6a4 4 0 1 0 4 4a4 4 0 0 0-4-4Zm0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2Z"></path>
                            </svg>
                            <span>Delivery Addresses</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm0 2h18M7 15h.01M11 15h2"></path>
                            </svg>
                            <span>Credit Cards</span>
                          </a>
                          <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" fill="none" height="24" className="mr-4">
                              <path fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0Zm-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"></path>
                              <path fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1ZM3 12c0 2.09.713 4.014 1.908 5.542A8.986 8.986 0 0 1 12.065 14a8.984 8.984 0 0 1 7.092 3.458A9 9 0 1 0 3 12Zm9 9a8.963 8.963 0 0 1-5.672-2.012A6.992 6.992 0 0 1 12.065 16a6.991 6.991 0 0 1 5.689 2.92A8.964 8.964 0 0 1 12 21Z"></path>
                            </svg>
                            <span>My Profile</span>
                          </a>
                        </nav>
                      </div>
                      {/* Logout at bottom */}
                      <div className="mt-auto pb-4">
                        <nav className="bg-top bg-cover">
                          <a 
                            href="#" 
                            onClick={handleSignOut}
                            className="font-medium text-sm items-center rounded-lg text-gray-900 mt-1 mx-4 px-4 py-2.5 block flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="mr-4">
                              <path fill="#000000" d="M16.07 8H15V5s0-5-5-5s-5 5-5 5v3H3.93A1.93 1.93 0 0 0 2 9.93v8.15A1.93 1.93 0 0 0 3.93 20h12.14A1.93 1.93 0 0 0 18 18.07V9.93A1.93 1.93 0 0 0 16.07 8zM10 16a2 2 0 1 1 2-2a2 2 0 0 1-2 2zm3-8H7V5.5C7 4 7 2 10 2s3 2 3 3.5z"></path>
                            </svg>
                            <span>Logout</span>
                          </a>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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