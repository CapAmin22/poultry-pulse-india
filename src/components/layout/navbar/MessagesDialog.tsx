
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { MessageSquare, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export interface MessagesDialogProps {
  open: boolean;
  onClose: () => void;
}

const MessagesDialog: React.FC<MessagesDialogProps> = ({ open, onClose }) => {
  // Sample messages data - in a real app, this would come from an API
  const messages = [
    {
      id: 1,
      sender: 'Ravi Singh',
      avatar: null,
      initials: 'RS',
      message: 'Do you have any Layer chicks available?',
      time: '15 minutes ago',
      unread: true
    },
    {
      id: 2,
      sender: 'Priya Sharma',
      avatar: null,
      initials: 'PS',
      message: 'I'm looking for Broiler feed suppliers in Bangalore area.',
      time: '2 hours ago',
      unread: false
    },
    {
      id: 3,
      sender: 'Amit Patel',
      avatar: null,
      initials: 'AP',
      message: 'Thanks for the consultation yesterday.',
      time: '1 day ago',
      unread: false
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-[#f5565c]" />
            Messages
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9 bg-gray-50"
          />
        </div>
        
        <div className="max-h-72 overflow-y-auto">
          {messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex p-3 rounded-lg cursor-pointer ${
                    message.unread ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={message.avatar || undefined} alt={message.sender} />
                    <AvatarFallback className="bg-[#ea384c] text-white">{message.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm ${message.unread ? 'font-semibold' : 'font-medium'}`}>
                        {message.sender}
                      </p>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.message}</p>
                    {message.unread && (
                      <span className="inline-block w-2 h-2 bg-[#f5565c] rounded-full ml-1"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">No messages</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesDialog;
