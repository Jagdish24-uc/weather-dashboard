import React, { useState } from "react";
import Chart from "chart.js/auto";
import "tailwindcss/tailwind.css";

const WeatherDashboard = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  let chartInstance = null;

  const fetchWeatherData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=auto`
      );
      const data = await response.json();
      setWeatherData(data.daily);
      renderChart(data.daily);
    } catch (error) {
      alert("Failed to fetch weather data. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (dailyData) => {
    const ctx = document.getElementById("weatherChart").getContext("2d");
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: dailyData.time,
        datasets: [
          {
            label: "Max Temp",
            data: dailyData.temperature_2m_max,
            borderColor: "rgb(255, 99, 132)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "Min Temp",
            data: dailyData.temperature_2m_min,
            borderColor: "rgb(54, 162, 235)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "Mean Temp",
            data: dailyData.temperature_2m_mean,
            borderColor: "rgb(255, 206, 86)",
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full bg-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
          Weather Dashboard
        </h1>
        <form
          onSubmit={fetchWeatherData}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="relative">
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-4 focus:ring-blue-300"
              required
              placeholder=" "
            />
            <label className="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 transition-all">
              Latitude
            </label>
          </div>
          <div className="relative">
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-4 focus:ring-blue-300"
              required
              placeholder=" "
            />
            <label className="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 transition-all">
              Longitude
            </label>
          </div>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-4 focus:ring-blue-300"
              required
            />
            <label className="absolute left-3 top-2 text-gray-400 text-sm">
              Start Date
            </label>
          </div>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-4 focus:ring-blue-300"
              required
            />
            <label className="absolute left-3 top-2 text-gray-400 text-sm">
              End Date
            </label>
          </div>
          <div className="col-span-1 md:col-span-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-8 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Fetch Weather
            </button>
          </div>
        </form>
        {loading && (
          <div className="text-center mt-10 text-lg font-medium animate-pulse">
            Loading...
          </div>
        )}
        <div className="mt-16">
          <canvas
            id="weatherChart"
            className="w-full max-w-4xl mx-auto"
          ></canvas>
        </div>
        <div className="mt-16 overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                <th className="border p-4">Date</th>
                <th className="border p-4">Max Temp (°C)</th>
                <th className="border p-4">Min Temp (°C)</th>
                <th className="border p-4">Mean Temp (°C)</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.time &&
                weatherData.time.map((date, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 odd:bg-white even:bg-gray-50"
                  >
                    <td className="border p-4">{date}</td>
                    <td className="border p-4">
                      {weatherData.temperature_2m_max[index]}
                    </td>
                    <td className="border p-4">
                      {weatherData.temperature_2m_min[index]}
                    </td>
                    <td className="border p-4">
                      {weatherData.temperature_2m_mean[index]}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
