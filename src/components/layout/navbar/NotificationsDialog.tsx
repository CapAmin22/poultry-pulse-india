
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';

export interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsDialog: React.FC<NotificationsDialogProps> = ({ open, onClose }) => {
  // Sample notification data - in a real app, this would come from an API
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Price Alert',
      message: 'Egg prices have increased by 5% in your region.',
      time: '15 minutes ago'
    },
    {
      id: 2,
      type: 'update',
      title: 'New Market Report',
      message: 'Monthly poultry market report is now available.',
      time: '2 hours ago'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Weather Warning',
      message: 'Heat wave expected in Northern regions next week.',
      time: '5 hours ago'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-[#f5565c]" />
            Notifications
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="mr-3 mt-0.5">
                    {notification.type === 'alert' ? (
                      <AlertTriangle className="text-amber-500 h-5 w-5" />
                    ) : (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">No notifications</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
