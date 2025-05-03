
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface WeatherAlert {
  id: number;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface WeatherAlertCardProps {
  alerts: WeatherAlert[];
  onViewAllClick: () => void;
}

const WeatherAlertCard: React.FC<WeatherAlertCardProps> = ({ alerts, onViewAllClick }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
          Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`p-3 rounded-lg border ${
              alert.severity === 'high' ? 'border-red-200 bg-red-50' : 
              alert.severity === 'medium' ? 'border-amber-200 bg-amber-50' : 
              'border-blue-200 bg-blue-50'
            }`}
          >
            <h4 className={`font-medium ${
              alert.severity === 'high' ? 'text-red-700' : 
              alert.severity === 'medium' ? 'text-amber-700' : 
              'text-blue-700'
            }`}>
              {alert.title}
            </h4>
            <p className="text-sm mt-1">{alert.description}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full" onClick={onViewAllClick}>
          View All Alerts
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeatherAlertCard;
