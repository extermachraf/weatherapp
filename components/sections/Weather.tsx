"use client";

import { WeatherResponse } from "@/types";
import { formatTime } from "@/utils";
import { motion } from "framer-motion";
import {
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  Thermometer,
  Eye,
} from "lucide-react";

const WeatherCard = ({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center justify-between h-[50px]"
  >
    <div className="flex items-center">
      <div className="mr-4 text-blue-500 dark:text-blue-400">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

const Weather = ({ data }: { data: WeatherResponse | null }) => {
  if (!data) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Weather data not available
      </div>
    );
  }

  const weatherCardArray = [
    {
      title: "Sunrise",
      icon: <Sunrise size={24} />,
      value: formatTime(data.sys.sunrise),
    },
    {
      title: "Sunset",
      icon: <Sunset size={24} />,
      value: formatTime(data.sys.sunset),
    },
    {
      title: "Wind",
      icon: <Wind size={24} />,
      value: `${data.wind.speed} km/h`,
    },
    {
      title: "Humidity",
      icon: <Droplets size={24} />,
      value: `${data.main.humidity}%`,
    },
    {
      title: "Feels Like",
      icon: <Thermometer size={24} />,
      value: `${Math.round(data.main.feels_like)}°C`,
    },
    {
      title: "Visibility",
      icon: <Eye size={24} />,
      value: `${data.visibility / 1000} km`,
    },
  ];

  return (
    <div className="space-y-2">
      {weatherCardArray.map((card) => (
        <WeatherCard
          key={card.title}
          title={card.title}
          icon={card.icon}
          value={card.value}
        />
      ))}
    </div>
  );
};

export default Weather;
