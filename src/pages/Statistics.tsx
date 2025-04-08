
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductionStats from '@/components/dashboard/ProductionStats';
import { motion } from 'framer-motion';
import { BarChart, BarChart3, AreaChart, PieChart, LineChart, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#EA384C', '#0FA0CE', '#36B37E', '#FFAB00', '#6554C0'];

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

const profitabilityData = [
  { name: 'Feed Cost', value: 45 },
  { name: 'Labor', value: 20 },
  { name: 'Utilities', value: 10 },
  { name: 'Healthcare', value: 15 },
  { name: 'Other', value: 10 },
];

const efficiencyData = [
  { quarter: 'Q1', efficiency: 78, average: 72 },
  { quarter: 'Q2', efficiency: 82, average: 74 },
  { quarter: 'Q3', efficiency: 85, average: 76 },
  { quarter: 'Q4', efficiency: 89, average: 78 },
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
            icon={<BarChart className="h-5 w-5 text-[#EA384C]" />}
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
            icon={<PieChart className="h-5 w-5 text-green-600" />}
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-md h-full">
              <CardHeader>
                <CardTitle>Production Efficiency</CardTitle>
                <CardDescription>Feed conversion ratio vs industry average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={efficiencyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis dataKey="quarter" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="efficiency" 
                        name="Your Farm" 
                        fill="#0FA0CE" 
                      />
                      <Bar 
                        dataKey="average" 
                        name="Industry Average" 
                        fill="#EA384C" 
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-md h-full">
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
                <CardDescription>Breakdown of operational costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={profitabilityData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {profitabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;
