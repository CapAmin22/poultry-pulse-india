
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  onItemClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navItems, onItemClick }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden block py-2 overflow-x-auto scrollbar-hide">
      <div className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md ${
              isActive(item.path)
                ? 'text-[#f5565c] bg-red-50'
                : 'text-gray-700 bg-gray-50'
            }`}
            onClick={onItemClick}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
