
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data - this would be replaced with actual API data
const data = [
  { name: 'Jan', eggPrice: 4.5, broilerPrice: 85 },
  { name: 'Feb', eggPrice: 4.2, broilerPrice: 90 },
  { name: 'Mar', eggPrice: 4.0, broilerPrice: 95 },
  { name: 'Apr', eggPrice: 4.3, broilerPrice: 92 },
  { name: 'May', eggPrice: 4.6, broilerPrice: 88 },
  { name: 'Jun', eggPrice: 4.8, broilerPrice: 86 },
  { name: 'Jul', eggPrice: 5.0, broilerPrice: 84 },
];

const PriceChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEgg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A365D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1A365D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBroiler" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#1A365D" />
              <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />
              <Tooltip />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="eggPrice"
                name="Egg Price (₹/piece)"
                stroke="#1A365D"
                fillOpacity={1}
                fill="url(#colorEgg)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="broilerPrice"
                name="Broiler Price (₹/kg)"
                stroke="#F59E0B"
                fillOpacity={1}
                fill="url(#colorBroiler)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-poultry-primary rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Egg Price (₹/piece)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-poultry-secondary rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Broiler Price (₹/kg)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
