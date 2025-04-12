
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, User, Loader2, AlertCircle } from 'lucide-react';
import { uploadProfileImage } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    setErrorMsg(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("File size must be less than 2MB");
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 2MB.",
      });
      // Clear the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setErrorMsg("File must be an image (JPEG, PNG, GIF, or WEBP)");
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG, GIF, or WEBP).",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setUploadingAvatar(true);
      setErrorMsg(null);
      
      // Initialize Supabase storage if needed
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'avatars')) {
        await supabase.storage.createBucket('avatars', { public: true });
      }

      const result = await uploadProfileImage(file, user.id);
      
      if (result.success && result.url) {
        if (onAvatarUpdate) {
          onAvatarUpdate(result.url);
        }
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully.",
        });
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrorMsg("Upload failed: " + (error.message || "Unknown error"));
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
        accept="image/jpeg,image/png,image/gif,image/webp"
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

      {errorMsg && (
        <div className="flex items-center text-red-500 text-xs mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
