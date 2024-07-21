import { GeoJsonData } from "../../../interfaces";
import mapboxgl from "mapbox-gl";
import axios from "axios";

const apiKey = "9a4c99157e7045b5a1f210949242107"; // Ensure to use your actual API key
const LAYER_ID = "zipcode-boundary";

// Function to fetch weather data
export const fetchWeatherData = async (zipCode: string) => {
  const url = `http://api.weatherapi.com/v1/current.json?q=${zipCode}&key=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

// Function to add or update the data source and layer
const updateDataSourceAndLayer = (map: mapboxgl.Map, geojson: any) => {
  if (map.getSource(LAYER_ID)) {
    (map.getSource(LAYER_ID) as mapboxgl.GeoJSONSource).setData(geojson);
  } else {
    map.addSource(LAYER_ID, {
      type: "geojson",
      data: geojson,
    });
  }

  if (!map.getLayer(LAYER_ID)) {
    map.addLayer({
      id: LAYER_ID,
      type: "fill",
      source: LAYER_ID,
      paint: {
        "fill-color": "#888888",
        "fill-opacity": 0.6,
      },
    });
  } else {
    map.setPaintProperty(LAYER_ID, "fill-color", "#888888");
    map.setPaintProperty(LAYER_ID, "fill-opacity", 0.6);
  }
};

// Function to calculate bounds from GeoJSON coordinates
const calculateBounds = (geojson: any) => {
  const bounds = new mapboxgl.LngLatBounds();
  const coordinates = geojson.features[0].geometry?.coordinates[0];
  for (const coord of coordinates) {
    bounds.extend([coord[0], coord[1]]);
  }
  return bounds;
};

// Function to handle the mouse leave event
const handleMouseLeave = (popup: mapboxgl.Popup, map: mapboxgl.Map) => {
  setTimeout(() => {
    map.getCanvas().style.cursor = "";
    // Assuming the popup is a global variable
    if (popup) {
      popup.remove();
    }
  }, 500);
};

// Function to handle the mouse enter event
const handleMouseEnter = async (
  popup: mapboxgl.Popup,
  e: mapboxgl.MapMouseEvent,
  zipCode: string,
  map: mapboxgl.Map,
  bounds: mapboxgl.LngLatBounds
) => {
  if (zipCode) {
    const weatherData = await fetchWeatherData(zipCode);

    if (weatherData) {
      const coordinates = bounds.getCenter();
      const popupContent = `
        <strong>Location:</strong> ${weatherData.location.name}<br>
        <strong>Temperature:</strong> ${weatherData.current.temp_c} °C<br>
        <strong>Time:</strong> ${new Date(weatherData.location.localtime).toLocaleTimeString()}
      `;

      popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
    }
  }
};

const updateLayer = (map: mapboxgl.Map, geojson: any, zipCode: string) => {
  updateDataSourceAndLayer(map, geojson);

  const bounds = calculateBounds(geojson);

  map.fitBounds(bounds, {
    padding: 20,
    maxZoom: 10,
  });

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("mouseenter", LAYER_ID, (e) =>
    handleMouseEnter(popup, e, zipCode, map, bounds)
  );
  map.on("mouseleave", LAYER_ID, () => handleMouseLeave(popup, map));
};

// Main function to update the bounding box
export const updateBoundingBox = async (
  zipCode: string,
  map: mapboxgl.Map,
  boundariesData: GeoJsonData
) => {
  if (map.isStyleLoaded()) {
    updateLayer(map, boundariesData, zipCode);
  } else {
    map.once("styledata", () => updateLayer(map, boundariesData, zipCode));
  }
};
