import axios from "axios";

const apiKey = "9a4c99157e7045b5a1f210949242107";

// Function to fetch weather data
export const fetchWeatherData = async (zipCode: string) => {
  const url = `https://api.weatherapi.com/v1/current.json?q=${zipCode}&key=${apiKey}&units=metric`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Error fetching weather data");
  }
};

export const fetchZipCodeBoundaries = async (zipCode: string) => {
  try {
    const url = `https://vanitysoft-boundaries-io-v1.p.rapidapi.com/rest/v1/public/boundary/zipcode`;

    const response = await axios.get(url, {
      params: { zipcode: zipCode },
      headers: {
        "x-rapidapi-host": "vanitysoft-boundaries-io-v1.p.rapidapi.com",
        "x-rapidapi-key": "5973e1d3ebmshd33070fdadabf88p10788cjsn699befb63255",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching zipcode boundaries:", error);
    throw new Error("Error fetching zipcode boundaries");
  }
};
