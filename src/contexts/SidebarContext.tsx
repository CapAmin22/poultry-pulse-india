
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  setSidebarOpen: () => {},
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check for saved state in localStorage, default to true on desktop and false on mobile
    const savedState = localStorage.getItem('sidebar-state');
    if (savedState !== null) {
      return savedState === 'open';
    }
    return window.innerWidth >= 768;
  });

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-state', sidebarOpen ? 'open' : 'closed');
  }, [sidebarOpen]);

  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        // Only auto-open on desktop if it wasn't explicitly closed by the user
        const savedState = localStorage.getItem('sidebar-state');
        if (savedState !== 'closed') {
          setSidebarOpen(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
