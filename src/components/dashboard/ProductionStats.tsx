
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Monthly production data for the current year
const productionData = [
  { month: 'Jan', eggs: 95.2, broiler: 420, layers: 280 },
  { month: 'Feb', eggs: 96.8, broiler: 435, layers: 282 },
  { month: 'Mar', eggs: 97.5, broiler: 450, layers: 285 },
  { month: 'Apr', eggs: 98.3, broiler: 445, layers: 287 },
  { month: 'May', eggs: 97.9, broiler: 440, layers: 285 },
  { month: 'Jun', eggs: 97.2, broiler: 435, layers: 283 },
  { month: 'Jul', eggs: 98.4, broiler: 430, layers: 286 },
  { month: 'Aug', eggs: 99.1, broiler: 445, layers: 290 },
  { month: 'Sep', eggs: 99.8, broiler: 455, layers: 292 },
  { month: 'Oct', eggs: 100.5, broiler: 460, layers: 295 },
  { month: 'Nov', eggs: 101.2, broiler: 465, layers: 297 },
  { month: 'Dec', eggs: 102.0, broiler: 470, layers: 300 },
];

// State-wise production data for regional comparison
const stateData = [
  { state: 'Andhra Pradesh', eggs: 24.5, broiler: 110, layers: 72 },
  { state: 'Tamil Nadu', eggs: 18.2, broiler: 85, layers: 65 },
  { state: 'Maharashtra', eggs: 15.8, broiler: 78, layers: 55 },
  { state: 'Punjab', eggs: 13.5, broiler: 65, layers: 48 },
  { state: 'Karnataka', eggs: 11.2, broiler: 58, layers: 42 },
  { state: 'Telangana', eggs: 8.9, broiler: 45, layers: 37 },
  { state: 'Haryana', eggs: 7.4, broiler: 38, layers: 32 },
  { state: 'West Bengal', eggs: 6.2, broiler: 35, layers: 28 },
];

const ProductionStats: React.FC = () => {
  const [viewType, setViewType] = useState<string>('monthly');
  const [selectedRange, setSelectedRange] = useState<string>('all');
  
  const getFilteredData = () => {
    if (selectedRange === 'q1') return productionData.slice(0, 3);
    if (selectedRange === 'q2') return productionData.slice(3, 6);
    if (selectedRange === 'q3') return productionData.slice(6, 9);
    if (selectedRange === 'q4') return productionData.slice(9, 12);
    return productionData;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Production Statistics</CardTitle>
            <CardDescription>National poultry production metrics</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Tabs 
              value={viewType} 
              onValueChange={setViewType} 
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
                <TabsTrigger value="regional">Regional Data</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {viewType === 'monthly' && (
              <Select value={selectedRange} onValueChange={setSelectedRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Full Year</SelectItem>
                  <SelectItem value="q1">Q1 (Jan-Mar)</SelectItem>
                  <SelectItem value="q2">Q2 (Apr-Jun)</SelectItem>
                  <SelectItem value="q3">Q3 (Jul-Sep)</SelectItem>
                  <SelectItem value="q4">Q4 (Oct-Dec)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="monthly" className="m-0">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getFilteredData()}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#1A365D" />
                <YAxis yAxisId="right" orientation="right" stroke="#ea384c" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="eggs" 
                  name="Egg Production (million/day)" 
                  stroke="#1A365D" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="broiler" 
                  name="Broiler Production (thousand tonnes)" 
                  stroke="#ea384c" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="layers" 
                  name="Layer Population (millions)" 
                  stroke="#0FA0CE" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="regional" className="m-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Egg Production<br/>(million/day)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Broiler Production<br/>(thousand tonnes)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Layer Population<br/>(millions)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stateData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{item.state}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.eggs}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.broiler}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.layers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stateData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="eggs" name="Egg Production" stroke="#1A365D" strokeWidth={2} />
                <Line type="monotone" dataKey="broiler" name="Broiler Production" stroke="#ea384c" strokeWidth={2} />
                <Line type="monotone" dataKey="layers" name="Layer Population" stroke="#0FA0CE" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default ProductionStats;
