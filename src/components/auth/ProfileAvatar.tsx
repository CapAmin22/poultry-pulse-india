
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, User, Loader2 } from 'lucide-react';
import { uploadProfileImage } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  fullName: string;
  onAvatarUpdate?: (url: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  avatarUrl, 
  fullName,
  onAvatarUpdate 
}) => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploadingAvatar(true);
      const result = await uploadProfileImage(file, user.id);
      
      if (result.success && result.url) {
        if (onAvatarUpdate) {
          onAvatarUpdate(result.url);
        }
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your image. Please try again.",
      });
    } finally {
      setUploadingAvatar(false);
      // Clear the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2" 
        disabled={uploadingAvatar || !user}
        onClick={handleUploadClick}
      >
        {uploadingAvatar ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </>
        )}
      </Button>
    </div>
  );
};

export default ProfileAvatar;
