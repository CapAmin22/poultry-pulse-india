
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductionStats from '@/components/dashboard/ProductionStats';
import { motion } from 'framer-motion';
import { BarChart3, AreaChart, LineChart, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';

const marketData = [
  { month: 'Jan', egg: 42, broiler: 38, layer: 28 },
  { month: 'Feb', egg: 43, broiler: 35, layer: 29 },
  { month: 'Mar', egg: 45, broiler: 39, layer: 30 },
  { month: 'Apr', egg: 44, broiler: 42, layer: 31 },
  { month: 'May', egg: 46, broiler: 45, layer: 32 },
  { month: 'Jun', egg: 48, broiler: 47, layer: 32 },
  { month: 'Jul', egg: 50, broiler: 49, layer: 33 },
  { month: 'Aug', egg: 52, broiler: 50, layer: 35 },
  { month: 'Sep', egg: 54, broiler: 52, layer: 36 },
  { month: 'Oct', egg: 55, broiler: 54, layer: 37 },
];

const keyInsightsData = [
  { region: 'North', eggPrice: 5.4, broilerPrice: 115, change: 2.3 },
  { region: 'South', eggPrice: 5.2, broilerPrice: 112, change: 1.7 },
  { region: 'East', eggPrice: 5.1, broilerPrice: 110, change: -0.8 },
  { region: 'West', eggPrice: 5.3, broilerPrice: 114, change: 3.2 },
  { region: 'Central', eggPrice: 5.2, broilerPrice: 111, change: 0.5 },
];

const StatCard = ({ title, value, change, icon, trend }: { 
  title: string; 
  value: string; 
  change: string; 
  icon: React.ReactNode; 
  trend: 'up' | 'down' | 'neutral' 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-gray-100">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trend === 'up' && <ArrowUp className="h-4 w-4 text-green-500 mr-1" />}
          {trend === 'down' && <ArrowDown className="h-4 w-4 text-red-500 mr-1" />}
          {trend === 'neutral' && <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />}
          <p className={`text-sm ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-blue-500'
          }`}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const Statistics: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Statistics Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Comprehensive analytics for your poultry business
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard 
            title="Egg Production" 
            value="95.2M/day" 
            change="↑ 3.2% vs last month" 
            icon={<BarChart3 className="h-5 w-5 text-[#EA384C]" />}
            trend="up"
          />
          <StatCard 
            title="Broiler Production" 
            value="435K tonnes" 
            change="↑ 1.8% vs last month" 
            icon={<AreaChart className="h-5 w-5 text-[#0FA0CE]" />}
            trend="up"
          />
          <StatCard 
            title="Feed Efficiency" 
            value="1.85 FCR" 
            change="↓ 0.05 vs last month" 
            icon={<LineChart className="h-5 w-5 text-green-600" />}
            trend="down"
          />
          <StatCard 
            title="Market Price" 
            value="₹112/kg" 
            change="→ No change" 
            icon={<LineChart className="h-5 w-5 text-amber-500" />}
            trend="neutral"
          />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md h-full">
              <CardHeader>
                <CardTitle>Production Metrics</CardTitle>
                <CardDescription>National production trends for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductionStats />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-md h-full">
              <CardHeader>
                <CardTitle>Market Prices</CardTitle>
                <CardDescription>Average market prices over time (₹/kg)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={marketData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="egg" 
                        name="Eggs (₹/dozen)" 
                        stroke="#EA384C" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="broiler" 
                        name="Broiler (₹/kg)" 
                        stroke="#0FA0CE" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="layer" 
                        name="Layer (₹/bird)" 
                        stroke="#36B37E" 
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* New Key Insights section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Key Insights: Market Prices</CardTitle>
              <CardDescription>Regional price comparison across India</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Region</th>
                      <th className="text-left py-3 px-4">Eggs (₹/dozen)</th>
                      <th className="text-left py-3 px-4">Broiler (₹/kg)</th>
                      <th className="text-left py-3 px-4">Weekly Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyInsightsData.map((item, index) => (
                      <tr key={item.region} className={index < keyInsightsData.length - 1 ? "border-b" : ""}>
                        <td className="py-3 px-4 font-medium">{item.region}</td>
                        <td className="py-3 px-4">₹{item.eggPrice.toFixed(1)}</td>
                        <td className="py-3 px-4">₹{item.broilerPrice}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.change > 0 
                              ? 'bg-green-100 text-green-800' 
                              : item.change < 0 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open("https://poultry.org.in/market-reports", "_blank")}
                >
                  View Detailed Market Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Statistics;
