
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data - this would be replaced with actual API data
const data = [
  { name: 'Corn', current: 30, previous: 28 },
  { name: 'Soybean', current: 22, previous: 20 },
  { name: 'Rice', current: 12, previous: 14 },
  { name: 'Wheat', current: 18, previous: 17 },
  { name: 'Fish Meal', current: 8, previous: 10 },
];

const FeedRatioChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feed Price Index</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="previous" name="Last Month (₹/kg)" fill="#94A3B8" />
              <Bar dataKey="current" name="Current Month (₹/kg)" fill="#1A365D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Last Month</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-poultry-primary rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Current Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedRatioChart;
