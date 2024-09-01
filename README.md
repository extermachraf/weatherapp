# Weather App

## Overview
This is a weather application built with Next.js, TypeScript, and Tailwind CSS. It allows users to search for weather information and receive forecasts based on their location.

## Features
- Search for weather information by city.
- View weather forecasts.
- Auto-complete city suggestions.
- Responsive design with support for dark and light modes.

## Getting Started

### 1. Obtain an OpenWeather API Key
To use this application, you need an API key from OpenWeather. Follow these steps to get your API key:
1. Visit the [OpenWeather website](https://openweathermap.org/api).
2. Sign up or log in to your account.
3. Navigate to the API section and generate a new API key.

### 2. Set Up Your Environment

1. **Create a `.env` File:**
   In the root directory of the project, create a file named `.env`.

2. **Add Your API Key:**
   Open the `.env` file and add the following line, replacing `"your-secret-key"` with your actual OpenWeather API key:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY="your-secret-key"

### 2. run the project

<!-- here i need you to add the instructions  -->
1. install teh node modules with npm install 
2. you can run the project in a dev mode using "npm run dev " or in production mode using "npm run build && npm start
