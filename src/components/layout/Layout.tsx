
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
