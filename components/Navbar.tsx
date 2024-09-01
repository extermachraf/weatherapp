"use client";

import { useLocationContext } from "@/context/ContextProvider";
import {
  getForecastByLocationService,
  getWeatherByLocationService,
} from "@/services";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from "react";
import axios from "axios";

type CitySuggestion = {
  name: string;
  country: string;
};

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const Navbar = () => {
  const { search, setSearch, setWeather, setForecast } = useLocationContext();
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (term: string) => {
    if (!term) return;

    try {
      const weather = await getWeatherByLocationService(term);
      setWeather(weather);
      const forecast = await getForecastByLocationService(term);
      setForecast(forecast);
      setErrorMessage(""); // Clear error message on successful search
      setSuggestions([]); // Clear suggestions on search
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setErrorMessage("Unable to fetch data. Please try again later.");
    }
  };

  const handleClick = () => {
    handleSearch(search);
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
        );
        setSuggestions(response.data);
        setErrorMessage(""); // Clear error message if fetching suggestions is successful
      } catch (error) {
        console.error("Failed to fetch city suggestions:", error);
        setErrorMessage("Failed to load suggestions. Please try again later.");
      }
    } else {
      setSuggestions([]); // Clear suggestions if input is less than 3 characters
    }
  };

  const handleSuggestionClick = (cityName: string) => {
    setSearch(cityName);
    handleSearch(cityName); // Automatically search when a suggestion is clicked
    setSuggestions([]); // Clear suggestions on click
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(search);
    }
  };

  // Handle clicks outside the suggestions list
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative bg-white dark:bg-gray-800 rounded-md px-4 py-2 sm:px-6 sm:py-3">
      <nav className="flex flex-col sm:flex-row sm:justify-between items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <ModeToggle />
        </div>
        <div className="relative flex flex-col sm:flex-row items-center">
          <Input
            ref={inputRef} // Set ref for input field
            type="text"
            placeholder="Search Location..."
            className="w-full sm:w-[300px] bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Handle Enter key
          />
          <Button
            onClick={handleClick}
            className="mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto"
          >
            Search
          </Button>
          {suggestions.length > 0 && (
            <ul
              ref={suggestionsRef} // Set ref for suggestions list
              className="absolute top-full left-0 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-md max-h-40 overflow-y-auto z-10 mt-1 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  {suggestion.name}, {suggestion.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
      {errorMessage && (
        <div className="mt-2 p-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
          {errorMessage}
        </div>
      )}
    </header>
  );
};

export default Navbar;
