
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, LineChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Sample data for charts
const productionData = [
  { month: 'Jan', eggs: 4000, broilers: 2400 },
  { month: 'Feb', eggs: 3000, broilers: 1398 },
  { month: 'Mar', eggs: 3500, broilers: 4800 },
  { month: 'Apr', eggs: 2780, broilers: 3908 },
  { month: 'May', eggs: 1890, broilers: 4800 },
  { month: 'Jun', eggs: 2390, broilers: 3800 },
  { month: 'Jul', eggs: 3490, broilers: 4300 },
];

const priceData = [
  { month: 'Jan', egg: 2.2, broiler: 110 },
  { month: 'Feb', egg: 2.8, broiler: 120 },
  { month: 'Mar', egg: 3.1, broiler: 130 },
  { month: 'Apr', egg: 3.9, broiler: 140 },
  { month: 'May', egg: 4.2, broiler: 120 },
  { month: 'Jun', egg: 5.0, broiler: 110 },
];

const marketShareData = [
  { name: 'Layer Farms', value: 35 },
  { name: 'Broiler Farms', value: 40 },
  { name: 'Integrated Farms', value: 15 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#0FA0CE', '#ea384c', '#FFA500', '#4CAF50'];

const StatisticsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Statistics" 
        description="View comprehensive poultry industry statistics"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Egg Production</p>
                <h3 className="text-2xl font-semibold">98.3M</h3>
                <div className="flex items-center text-green-600 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+2.1% from last month</span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-[#0FA0CE]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Egg Price</p>
                <h3 className="text-2xl font-semibold">₹5.20</h3>
                <div className="flex items-center text-green-600 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+3.5% from last week</span>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-[#ea384c]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Broiler Price</p>
                <h3 className="text-2xl font-semibold">₹112/kg</h3>
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  <span>-1.8% from last week</span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <LineChart className="h-6 w-6 text-[#0FA0CE]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Feed Price Index</p>
                <h3 className="text-2xl font-semibold">124.5</h3>
                <div className="flex items-center text-green-600 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+5.2% YTD</span>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <PieChart className="h-6 w-6 text-[#ea384c]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle>Production Trends</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="eggs" name="Egg Production (000s)" fill="#0FA0CE" />
                <Bar dataKey="broilers" name="Broiler Production (tons)" fill="#ea384c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle>Price Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#0FA0CE" />
                <YAxis yAxisId="right" orientation="right" stroke="#ea384c" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="egg" name="Egg Price (₹)" stroke="#0FA0CE" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="broiler" name="Broiler Price (₹/kg)" stroke="#ea384c" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white shadow-sm lg:col-span-1">
          <CardHeader className="pb-1">
            <CardTitle>Market Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Northern Region</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0FA0CE] h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Southern Region</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#ea384c] h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Eastern Region</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#FFA500] h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Western Region</span>
                  <span className="text-sm font-medium">8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#4CAF50] h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPage;
