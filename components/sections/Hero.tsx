"use client";

import { WeatherResponse } from "@/types";
import { findTime } from "@/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  Wind,
} from "lucide-react";

const Hero = ({ data }: { data: WeatherResponse | null }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data) return null;

  const [day, time] = findTime(data.dt, data.timezone);
  const { temp, feels_like, humidity } = data.main;
  const { speed: windSpeed } = data.wind;
  const weatherMain = data.weather[0].main.toLowerCase();

  const getWeatherIcon = (weather: string) => {
    const iconClass = "w-12 h-12 sm:w-16 sm:h-16";
    switch (weather) {
      case "clear":
        return time.includes("AM") ? (
          <Sun className={`${iconClass} text-yellow-400`} />
        ) : (
          <Moon className={`${iconClass} text-blue-200`} />
        );
      case "clouds":
        return <Cloud className={`${iconClass} text-gray-400`} />;
      case "rain":
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case "snow":
        return <CloudSnow className={`${iconClass} text-blue-200`} />;
      case "mist":
      case "fog":
        return <CloudFog className={`${iconClass} text-gray-300`} />;
      default:
        return <Wind className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden"
      >
        <div className="p-4 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2">
                {data.name}
              </h1>
              <p className="text-lg sm:text-xl opacity-75">
                {data.sys.country}
              </p>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <p className="text-base sm:text-lg">{day}</p>
              <p className="text-xl sm:text-3xl font-semibold">{time}</p>
            </div>
          </div>

          <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center">
              {getWeatherIcon(weatherMain)}
              <div className="ml-4">
                <p className="text-4xl sm:text-6xl font-bold">
                  {Math.round(temp)}°C
                </p>
                <p className="text-lg sm:text-xl capitalize">
                  {data.weather[0].description}
                </p>
              </div>
            </div>
            {/* <div className="text-left sm:text-right mt-4 sm:mt-0">
              <p className="text-base sm:text-lg">
                Feels like: {Math.round(feels_like)}°C
              </p>
              <p className="text-base sm:text-lg">Humidity: {humidity}%</p>
              <p className="text-base sm:text-lg">
                Wind: {Math.round(windSpeed * 3.6)} km/h
              </p>
            </div> */}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
