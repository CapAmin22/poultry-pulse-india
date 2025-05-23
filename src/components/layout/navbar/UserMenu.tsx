import React from 'react';
import { User } from '@supabase/supabase-js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Settings, User as UserIcon, LogOut } from 'lucide-react';
export interface UserMenuProps {
  user: User;
  onSignOut: () => Promise<void>;
}
const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onSignOut
}) => {
  const navigate = useNavigate();
  const userInitials = user.user_metadata?.full_name ? `${user.user_metadata.full_name.split(' ')[0][0]}${user.user_metadata.full_name.split(' ')[1]?.[0] || ''}` : user.email?.[0].toUpperCase() || '?';
  return <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer focus:outline-none">
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || 'User'} />
          <AvatarFallback className="bg-[#f5565c] text-white">{userInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <div className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</div>
          <div className="text-xs text-gray-500 truncate">{user.email}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
          <UserIcon className="h-4 w-4 mr-2" />
          My Profile
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 hover:text-red-600 cursor-pointer" onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
};
export default UserMenu;