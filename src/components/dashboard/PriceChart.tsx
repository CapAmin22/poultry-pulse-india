
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Enhanced yearly data for comprehensive analysis
const yearlyData = [
  { name: 'Jan', eggPrice: 4.5, broilerPrice: 85, feedCost: 32 },
  { name: 'Feb', eggPrice: 4.2, broilerPrice: 90, feedCost: 33 },
  { name: 'Mar', eggPrice: 4.0, broilerPrice: 95, feedCost: 34 },
  { name: 'Apr', eggPrice: 4.3, broilerPrice: 92, feedCost: 33 },
  { name: 'May', eggPrice: 4.6, broilerPrice: 88, feedCost: 34 },
  { name: 'Jun', eggPrice: 4.8, broilerPrice: 86, feedCost: 35 },
  { name: 'Jul', eggPrice: 5.0, broilerPrice: 84, feedCost: 36 },
  { name: 'Aug', eggPrice: 5.2, broilerPrice: 89, feedCost: 36 },
  { name: 'Sep', eggPrice: 5.4, broilerPrice: 94, feedCost: 35 },
  { name: 'Oct', eggPrice: 5.3, broilerPrice: 97, feedCost: 34 },
  { name: 'Nov', eggPrice: 5.1, broilerPrice: 93, feedCost: 33 },
  { name: 'Dec', eggPrice: 4.9, broilerPrice: 88, feedCost: 32 },
];

// Data for previous year for comparison
const previousYearData = [
  { name: 'Jan', eggPrice: 4.3, broilerPrice: 82, feedCost: 30 },
  { name: 'Feb', eggPrice: 4.0, broilerPrice: 85, feedCost: 31 },
  { name: 'Mar', eggPrice: 3.8, broilerPrice: 88, feedCost: 32 },
  { name: 'Apr', eggPrice: 4.0, broilerPrice: 87, feedCost: 32 },
  { name: 'May', eggPrice: 4.2, broilerPrice: 85, feedCost: 33 },
  { name: 'Jun', eggPrice: 4.5, broilerPrice: 83, feedCost: 33 },
  { name: 'Jul', eggPrice: 4.7, broilerPrice: 80, feedCost: 34 },
  { name: 'Aug', eggPrice: 4.9, broilerPrice: 84, feedCost: 34 },
  { name: 'Sep', eggPrice: 5.0, broilerPrice: 89, feedCost: 33 },
  { name: 'Oct', eggPrice: 4.9, broilerPrice: 91, feedCost: 32 },
  { name: 'Nov', eggPrice: 4.8, broilerPrice: 88, feedCost: 31 },
  { name: 'Dec', eggPrice: 4.6, broilerPrice: 84, feedCost: 30 },
];

const PriceChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('year');
  const [showComparison, setShowComparison] = useState<boolean>(false);
  
  // Determine which data to display based on the selected time range
  const getCurrentData = () => {
    if (timeRange === 'quarter') {
      return yearlyData.slice(0, 3);
    } else if (timeRange === 'half') {
      return yearlyData.slice(0, 6);
    }
    return yearlyData;
  };
  
  const displayData = showComparison 
    ? getCurrentData().map((item, index) => ({
      ...item,
      prevYearEggPrice: previousYearData[index].eggPrice,
      prevYearBroilerPrice: previousYearData[index].broilerPrice,
      prevYearFeedCost: previousYearData[index].feedCost,
    }))
    : getCurrentData();

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-xl">Price Trends</CardTitle>
            <CardDescription>Annual pricing data for key poultry commodities</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="half">Half Year</SelectItem>
                <SelectItem value="year">Full Year</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="comparison"
                checked={showComparison}
                onChange={() => setShowComparison(!showComparison)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="comparison" className="text-xs sm:text-sm">Show YoY comparison</label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEgg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A365D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1A365D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBroiler" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea384c" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ea384c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0FA0CE" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0FA0CE" stopOpacity={0} />
                </linearGradient>
                {showComparison && (
                  <>
                    <linearGradient id="prevEgg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A365D" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1A365D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="prevBroiler" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea384c" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ea384c" stopOpacity={0} />
                    </linearGradient>
                  </>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#1A365D" />
              <YAxis yAxisId="right" orientation="right" stroke="#ea384c" />
              <Tooltip />
              <Legend />
              
              {/* Current year data */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="eggPrice"
                name="Egg Price (₹/piece)"
                stroke="#1A365D"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEgg)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="broilerPrice"
                name="Broiler Price (₹/kg)"
                stroke="#ea384c"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBroiler)"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="feedCost"
                name="Feed Cost (₹/kg)"
                stroke="#0FA0CE"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFeed)"
              />
              
              {/* Previous year comparison data */}
              {showComparison && (
                <>
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="prevYearEggPrice"
                    name="Prev Year Egg Price"
                    stroke="#1A365D"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    fillOpacity={0}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="prevYearBroilerPrice"
                    name="Prev Year Broiler Price"
                    stroke="#ea384c"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    fillOpacity={0}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="prevYearFeedCost"
                    name="Prev Year Feed Cost"
                    stroke="#0FA0CE"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    fillOpacity={0}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
