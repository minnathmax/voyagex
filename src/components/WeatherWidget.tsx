import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudSun, Sun, CloudRain, Wind, Droplets } from 'lucide-react';

interface WeatherWidgetProps {
  climate: string;
}

export const WeatherWidget = ({ climate }: { climate: string }) => {
  // Generate a mock 5-day forecast based on the general climate string
  const isTropical = climate.toLowerCase().includes('tropical');
  const isCold = climate.toLowerCase().includes('cold') || climate.toLowerCase().includes('alpine');
  
  const baseTemp = isTropical ? 28 : (isCold ? 2 : 18);
  
  const forecast = [
    { day: 'Mon', temp: baseTemp + 2, icon: Sun, condition: 'Sunny' },
    { day: 'Tue', temp: baseTemp + 1, icon: CloudSun, condition: 'Partly Cloudy' },
    { day: 'Wed', temp: baseTemp, icon: isTropical ? CloudRain : CloudSun, condition: isTropical ? 'Showers' : 'Cloudy' },
    { day: 'Thu', temp: baseTemp - 1, icon: Wind, condition: 'Breezy' },
    { day: 'Fri', temp: baseTemp + 1, icon: Sun, condition: 'Sunny' },
  ];

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-white border-sky-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-semibold text-sky-900 mb-1 flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-sky-500" />
              Local Weather
            </h3>
            <p className="text-sm text-sky-600 capitalize">{climate} Climate</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-sky-900">{baseTemp}°C</span>
            <p className="text-xs text-sky-500 mt-1 flex items-center justify-end gap-1">
              <Droplets className="h-3 w-3" /> 65% Humidity
            </p>
          </div>
        </div>

        {/* 5 Day Forecast */}
        <div className="flex justify-between items-center pt-4 border-t border-sky-100">
          {forecast.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-500">{day.day}</span>
              <day.icon className={`h-6 w-6 ${
                day.condition === 'Sunny' ? 'text-yellow-500' :
                day.condition === 'Showers' ? 'text-blue-500' :
                'text-gray-400'
              }`} />
              <span className="text-sm font-bold text-gray-700">{day.temp}°</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
