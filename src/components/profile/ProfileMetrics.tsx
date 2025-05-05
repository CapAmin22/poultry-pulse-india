
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Users, ShoppingCart } from 'lucide-react';

interface ProfileMetricsProps {
  role: string;
  userId: string;
}

const ProfileMetrics: React.FC<ProfileMetricsProps> = ({ role, userId }) => {
  // These would ideally be fetched from Supabase based on user activity
  const getMetrics = () => {
    switch (role) {
      case 'farmer':
        return [
          { label: 'Active Listings', value: '3', icon: <ShoppingCart className="h-4 w-4 text-blue-500" /> },
          { label: 'Market Connections', value: '12', icon: <Users className="h-4 w-4 text-green-500" /> },
          { label: 'Price Trend', value: '+5.2%', icon: <TrendingUp className="h-4 w-4 text-red-500" /> },
          { label: 'Activity Score', value: '85', icon: <Activity className="h-4 w-4 text-purple-500" /> }
        ];
      
      case 'financial':
        return [
          { label: 'Services Offered', value: '4', icon: <ShoppingCart className="h-4 w-4 text-blue-500" /> },
          { label: 'Client Connections', value: '23', icon: <Users className="h-4 w-4 text-green-500" /> },
          { label: 'Approval Rate', value: '78%', icon: <TrendingUp className="h-4 w-4 text-red-500" /> },
          { label: 'Activity Score', value: '92', icon: <Activity className="h-4 w-4 text-purple-500" /> }
        ];

      case 'trainer':
        return [
          { label: 'Courses Offered', value: '7', icon: <ShoppingCart className="h-4 w-4 text-blue-500" /> },
          { label: 'Student Connections', value: '45', icon: <Users className="h-4 w-4 text-green-500" /> },
          { label: 'Satisfaction Rating', value: '4.8', icon: <TrendingUp className="h-4 w-4 text-red-500" /> },
          { label: 'Activity Score', value: '89', icon: <Activity className="h-4 w-4 text-purple-500" /> }
        ];

      default:
        return [
          { label: 'Marketplace Activity', value: '5', icon: <ShoppingCart className="h-4 w-4 text-blue-500" /> },
          { label: 'Network Connections', value: '8', icon: <Users className="h-4 w-4 text-green-500" /> },
          { label: 'Engagement Rate', value: '62%', icon: <TrendingUp className="h-4 w-4 text-red-500" /> },
          { label: 'Activity Score', value: '74', icon: <Activity className="h-4 w-4 text-purple-500" /> }
        ];
    }
  };

  const metrics = getMetrics();

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md">
              {metric.icon}
              <h3 className="mt-2 text-xl font-bold">{metric.value}</h3>
              <p className="text-xs text-gray-500 text-center">{metric.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileMetrics;
