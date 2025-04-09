
import React from 'react';
import { CloudSun, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    day: string;
    temp: number;
    condition: string;
  }[];
}

interface WeatherCardProps {
  weather: WeatherData;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Weather Update</span>
          <CloudSun className="h-5 w-5 text-poultry-secondary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{weather.location}</h3>
            <p className="text-sm text-gray-500">{weather.condition}</p>
          </div>
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 mr-1 text-red-500" />
            <span className="text-2xl font-bold">{weather.temperature}°C</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500">Humidity</span>
            <p className="font-medium">{weather.humidity}%</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500">Wind</span>
            <p className="font-medium">{weather.windSpeed} km/h</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">3-Day Forecast</h4>
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-center">
                <p className="text-xs">{day.day}</p>
                <p className="font-medium">{day.temp}°C</p>
                <p className="text-xs text-gray-500">{day.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
