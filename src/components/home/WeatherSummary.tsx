
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, AlertTriangle, MapPin, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  alert?: string;
}

interface WeatherSummaryProps {
  weather: WeatherData;
}

const WeatherSummary: React.FC<WeatherSummaryProps> = ({ weather }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Weather Update</span>
          <CloudSun className="h-5 w-5 text-[#0FA0CE]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm font-medium">{weather.location}</span>
          </div>
          <div className="text-sm text-gray-500">{weather.condition}</div>
        </div>
        
        <div className="flex items-center justify-center py-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Thermometer className="h-10 w-10 mr-3 text-[#ea384c]" />
            <div className="text-5xl font-bold">{weather.temperature}°C</div>
          </motion.div>
        </div>
        
        {weather.alert && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500 mt-0.5" />
            <p className="text-sm">{weather.alert}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherSummary;
