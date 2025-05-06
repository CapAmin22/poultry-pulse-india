
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Share2, Heart, MessageSquare, Trash, Map, Calendar, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface MarketplaceListingProps {
  listing: {
    id: string;
    title: string;
    price: string;
    description: string;
    location: string;
    image_url?: string;
    category: string;
    quantity?: string;
    created_at: string;
    user_id?: string;
  };
  canEdit?: boolean;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

const MarketplaceListing: React.FC<MarketplaceListingProps> = ({ 
  listing, 
  canEdit = false, 
  onDelete,
  onClick
}) => {
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved items" : "Added to saved items",
      description: isSaved 
        ? "The item has been removed from your saved list." 
        : "The item has been added to your saved list."
    });
  };
  
  const handleShare = () => {
    // Create a shareable link (in a real app, this would be a proper URL)
    const shareText = `Check out this listing on 22POULTRY: ${listing.title} - ${listing.price}`;
    
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: shareText,
        url: window.location.href
      })
      .catch(err => {
        console.error('Error sharing:', err);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Listing link has been copied to clipboard.",
    });
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(listing.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleContact = () => {
    toast({
      title: "Contact initiated",
      description: "You can now message the seller about this item.",
    });
  };

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={(e) => {
          // Don't open details if clicking on action buttons
          if ((e.target as HTMLElement).closest('button')) return;
          setIsDetailDialogOpen(true);
          if (onClick) onClick();
        }}
      >
        <div className="relative aspect-square">
          <img
            src={listing.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
            alt={listing.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="bg-gray-100 bg-opacity-90">
              {listing.category}
            </Badge>
            {listing.quantity && (
              <Badge variant="outline" className="bg-white bg-opacity-90">
                {listing.quantity}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium truncate">{listing.title}</h3>
          <p className="text-[#f5565c] font-medium mt-1">{listing.price}</p>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Map className="h-3.5 w-3.5 mr-1" /> {listing.location}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{listing.description}</p>
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" /> 
              Posted: {formatDate(listing.created_at)}
            </span>
            <Button variant="default" size="sm" className="bg-poultry-primary hover:bg-poultry-primary/90">
              View Details
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-1 h-8 w-8 ${isSaved ? 'text-red-500' : 'text-gray-400'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8 text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8 text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContact();
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
            
            {canEdit && onDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 text-red-500 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Listing Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{listing.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative aspect-video rounded-md overflow-hidden">
              <img
                src={listing.image_url || 'https://via.placeholder.com/600x400?text=No+Image'} 
                alt={listing.title}
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-xl font-medium text-[#f5565c]">{listing.price}</p>
              <div className="flex gap-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {listing.category}
                </Badge>
                {listing.quantity && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {listing.quantity}
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Location</h4>
              <p className="flex items-center text-gray-800">
                <Map className="h-4 w-4 mr-1 text-gray-400" />
                {listing.location}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="text-gray-800 whitespace-pre-line">{listing.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Listed On</h4>
              <p className="flex items-center text-gray-800">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                {formatDate(listing.created_at)}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4">
              <Button 
                onClick={handleContact} 
                className="bg-poultry-primary hover:bg-poultry-primary/90"
              >
                <MessageSquare className="h-4 w-4 mr-2" /> Contact Seller
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSave}
                className={isSaved ? "border-red-200 text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} /> 
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MarketplaceListing;
