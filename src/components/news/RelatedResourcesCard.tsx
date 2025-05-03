
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Resource {
  id: number;
  title: string;
}

interface RelatedResourcesCardProps {
  resources: Resource[];
}

const RelatedResourcesCard: React.FC<RelatedResourcesCardProps> = ({ resources }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Related Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          {resources.map(resource => (
            <Button key={resource.id} variant="outline" className="justify-start" size="sm">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              {resource.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedResourcesCard;
