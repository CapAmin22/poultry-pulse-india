
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
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  read: boolean;
}

interface MessagesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
  onMarkAllRead: () => void;
}

const MessagesDialog: React.FC<MessagesDialogProps> = ({
  isOpen,
  onOpenChange,
  messages,
  onMarkAllRead,
}) => {
  const navigate = useNavigate();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Messages</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMarkAllRead}
              className="text-sm text-[#f5565c] hover:text-[#d22f42] hover:bg-red-50"
            >
              Mark All Read
            </Button>
          </DialogTitle>
          <DialogDescription>
            Messages from our support team and partners.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {messages.map((message) => (
                <div key={message.id} className={`py-3 px-1 ${message.read ? 'opacity-70' : ''}`}>
                  <div className="flex justify-between">
                    <h4 className="font-medium">{message.sender}</h4>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              navigate('/contact');
            }}
          >
            Contact Support
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesDialog;
