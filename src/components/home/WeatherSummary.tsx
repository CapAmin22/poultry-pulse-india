
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, AlertTriangle, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  alert?: string;
}

interface WeatherSummaryProps {
  weather: WeatherData;
}

const WeatherSummary: React.FC<WeatherSummaryProps> = ({ weather }) => {
  return (
    <Card className="h-full border shadow-lg overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardTitle className="text-xl flex items-center justify-between">
          <span className="font-medium">Weather Update</span>
          <CloudSun className="h-5 w-5 text-white" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm font-medium">{weather.location}</span>
          </div>
          <div className="text-sm text-gray-500">{weather.condition}</div>
        </div>
        
        <div className="flex items-center justify-center py-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Thermometer className="h-10 w-10 mr-3 text-[#f5565c]" />
            <div className="text-5xl font-bold text-gray-800">{weather.temperature}°C</div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          {weather.humidity && (
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <Droplets className="h-4 w-4 text-[#0066b2] mr-2" />
              <span className="text-gray-700">Humidity: <span className="font-medium">{weather.humidity}%</span></span>
            </div>
          )}
          
          {weather.windSpeed && (
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <Wind className="h-4 w-4 text-[#0066b2] mr-2" />
              <span className="text-gray-700">Wind: <span className="font-medium">{weather.windSpeed} km/h</span></span>
            </div>
          )}
        </div>
        
        {weather.alert && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-amber-50 text-amber-800 p-3 rounded-lg flex items-start border border-amber-200"
          >
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500 mt-0.5" />
            <p className="text-sm">{weather.alert}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherSummary;
