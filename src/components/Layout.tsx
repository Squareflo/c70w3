import React from 'react';
import { Navbar } from '@/components/ui/navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true }) => {
  return (
    <div>
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
};