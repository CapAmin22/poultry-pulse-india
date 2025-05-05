
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  };
  canEdit?: boolean;
  onDelete?: (id: string) => void;
}

const MarketplaceListing: React.FC<MarketplaceListingProps> = ({ 
  listing, 
  canEdit = false, 
  onDelete 
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <img
          src={listing.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
          alt={listing.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 bg-opacity-90">
            {listing.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium truncate">{listing.title}</h3>
        <p className="text-[#f5565c] font-medium mt-1">{listing.price}</p>
        <p className="text-sm text-gray-600 mt-1">{listing.location}</p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{listing.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-500">
            Posted: {new Date(listing.created_at).toLocaleDateString()}
          </span>
          <Button variant="default" size="sm" className="bg-poultry-primary hover:bg-poultry-primary/90">
            View Details
          </Button>
        </div>
        
        {canEdit && onDelete && (
          <div className="mt-2 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-200 text-red-500 hover:bg-red-50"
              onClick={() => onDelete(listing.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MarketplaceListing;
