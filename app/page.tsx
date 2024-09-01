"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import Hero from "@/components/sections/Hero";
import Weather from "@/components/sections/Weather";
import { useLocationContext } from "@/context/ContextProvider";
import {
  getForecastByLocationService,
  getWeatherByLocationService,
} from "@/services";

export default function Home() {
  const { weather, setWeather, forecast, setForecast } = useLocationContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const weatherData = await getWeatherByLocationService("Marrakesh");
      setWeather(weatherData);
      const forecastData = await getForecastByLocationService("Marrakesh");
      setForecast(forecastData);
    };
    fetchWeatherData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const forecastData =
    forecast?.list?.slice(0, 10).map((entry) => ({
      time: new Date(entry.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: Math.round(entry.main.temp),
    })) || [];

  const chartConfig = {
    temp: {
      label: "Temperature",
      color: "url(#colorGradient)",
    },
  };

  const DesktopChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={forecastData}
        // margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="1" x2="0" y2="0">
            <stop
              offset="0%"
              stopColor="hsl(217, 91%, 60%)"
              stopOpacity={0.8}
            />
            <stop
              offset="100%"
              stopColor="hsl(0, 91%, 60%)"
              stopOpacity={0.8}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
          tickFormatter={(value) => `${value}°`}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg bg-white dark:bg-gray-700 p-2 shadow-md border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{`${payload[0].payload.time}`}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{`Temperature: ${payload[0].value}°`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="url(#colorGradient)"
          fillOpacity={1}
          fill="url(#colorGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 rounded-md">
      <div className="container mx-auto px-4 py-8">
        <Hero data={weather} />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Current Weather
            </h2>
            <Weather data={weather} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-[440px] border">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Temperature Forecast
            </h2>
            <div className="w-full h-[200px] sm:h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <DesktopChart />
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
