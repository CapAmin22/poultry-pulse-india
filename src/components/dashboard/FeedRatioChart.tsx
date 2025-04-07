
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced data with quarterly breakdown
const quarterlyData = [
  { quarter: 'Q1', name: 'Corn', current: 30, previous: 28, yearChange: '+7.1%' },
  { quarter: 'Q1', name: 'Soybean', current: 22, previous: 20, yearChange: '+10.0%' },
  { quarter: 'Q1', name: 'Rice', current: 12, previous: 14, yearChange: '-14.3%' },
  { quarter: 'Q1', name: 'Wheat', current: 18, previous: 17, yearChange: '+5.9%' },
  { quarter: 'Q1', name: 'Fish Meal', current: 8, previous: 10, yearChange: '-20.0%' },
  
  { quarter: 'Q2', name: 'Corn', current: 32, previous: 29, yearChange: '+10.3%' },
  { quarter: 'Q2', name: 'Soybean', current: 24, previous: 21, yearChange: '+14.3%' },
  { quarter: 'Q2', name: 'Rice', current: 11, previous: 13, yearChange: '-15.4%' },
  { quarter: 'Q2', name: 'Wheat', current: 19, previous: 18, yearChange: '+5.6%' },
  { quarter: 'Q2', name: 'Fish Meal', current: 9, previous: 10, yearChange: '-10.0%' },
  
  { quarter: 'Q3', name: 'Corn', current: 34, previous: 31, yearChange: '+9.7%' },
  { quarter: 'Q3', name: 'Soybean', current: 25, previous: 22, yearChange: '+13.6%' },
  { quarter: 'Q3', name: 'Rice', current: 10, previous: 12, yearChange: '-16.7%' },
  { quarter: 'Q3', name: 'Wheat', current: 20, previous: 19, yearChange: '+5.3%' },
  { quarter: 'Q3', name: 'Fish Meal', current: 9, previous: 11, yearChange: '-18.2%' },
  
  { quarter: 'Q4', name: 'Corn', current: 33, previous: 30, yearChange: '+10.0%' },
  { quarter: 'Q4', name: 'Soybean', current: 23, previous: 21, yearChange: '+9.5%' },
  { quarter: 'Q4', name: 'Rice', current: 11, previous: 13, yearChange: '-15.4%' },
  { quarter: 'Q4', name: 'Wheat', current: 21, previous: 20, yearChange: '+5.0%' },
  { quarter: 'Q4', name: 'Fish Meal', current: 8, previous: 10, yearChange: '-20.0%' }
];

const FeedRatioChart: React.FC = () => {
  const [activeQuarter, setActiveQuarter] = useState<string>('Q1');
  
  const filteredData = quarterlyData.filter(item => item.quarter === activeQuarter);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Feed Price Index</CardTitle>
            <CardDescription>Quarterly feed ingredient prices (₹/kg)</CardDescription>
          </div>
          <Tabs value={activeQuarter} onValueChange={setActiveQuarter} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="Q1">Q1</TabsTrigger>
              <TabsTrigger value="Q2">Q2</TabsTrigger>
              <TabsTrigger value="Q3">Q3</TabsTrigger>
              <TabsTrigger value="Q4">Q4</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value} ₹/kg`, name]}
                labelFormatter={(label) => `Ingredient: ${label}`}
              />
              <Legend />
              <Bar dataKey="previous" name="Last Year (₹/kg)" fill="#94A3B8" />
              <Bar dataKey="current" name="Current Year (₹/kg)" fill="#ea384c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Ingredient</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Current (₹/kg)</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Previous (₹/kg)</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">YoY Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2">{item.current}</td>
                  <td className="px-4 py-2">{item.previous}</td>
                  <td className={`px-4 py-2 ${item.yearChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {item.yearChange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedRatioChart;
