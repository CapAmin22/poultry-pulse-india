
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, User } from 'lucide-react';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  fullName: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, fullName }) => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="w-24 h-24">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={fullName} />
        ) : (
          <AvatarFallback className="text-lg bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white">
            {fullName ? getInitials(fullName) : <User className="h-10 w-10" />}
          </AvatarFallback>
        )}
      </Avatar>
      <Button variant="outline" size="sm" className="mt-2" disabled={uploadingAvatar}>
        <Upload className="h-4 w-4 mr-2" />
        Upload Photo
      </Button>
    </div>
  );
};

export default ProfileAvatar;
