
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onClearAll: () => void;
}

const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
  isOpen,
  onOpenChange,
  notifications,
  onClearAll,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Notifications</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearAll}
              className="text-sm text-[#f5565c] hover:text-[#d22f42] hover:bg-red-50"
            >
              Clear All
            </Button>
          </DialogTitle>
          <DialogDescription>
            Stay updated with the latest information.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div key={notification.id} className={`py-3 px-1 ${notification.read ? 'opacity-70' : ''}`}>
                  <div className="flex justify-between">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
