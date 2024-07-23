import { GeoJsonData } from "../interfaces";
import mapboxgl from "mapbox-gl";
import { fetchWeatherData } from "./api.utils";

const LAYER_ID = "zipcode-boundary";

const removeExistingLayers = (map: mapboxgl.Map) => {
  if (map.getLayer(LAYER_ID)) {
    map.removeLayer(LAYER_ID);
  }
  if (map.getLayer(`${LAYER_ID}-border`)) {
    map.removeLayer(`${LAYER_ID}-border`);
  }

  if (map.getSource(LAYER_ID)) {
    map.removeSource(LAYER_ID);
  }
};

const addLayers = (map: mapboxgl.Map, geojson: any) => {
  // Add the fill layer
  map.addLayer({
    id: LAYER_ID,
    type: "fill",
    source: {
      type: "geojson",
      data: geojson,
    },
    paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.6,
    },
  });

  // Add the border layer
  map.addLayer({
    id: `${LAYER_ID}-border`,
    type: "line",
    source: LAYER_ID,
    paint: {
      "line-color": "#000000",
      "line-width": 2,
    },
  });
};

// Function to add or update the data source and layer
const updateDataSourceAndLayer = (map: mapboxgl.Map, geojson: any) => {
  removeExistingLayers(map);
  addLayers(map, geojson);
};

// Main function to update the bounding box
export const updateBoundingBox = async (
  map: mapboxgl.Map,
  boundariesData: GeoJsonData
) => {
  if (map.isStyleLoaded()) {
    updateDataSourceAndLayer(map, boundariesData);
  } else {
    map.once("styledata", () => updateDataSourceAndLayer(map, boundariesData));
  }
};

// Function to handle the mouse leave event
export const handleMouseLeave = (popup: mapboxgl.Popup, map: mapboxgl.Map) => {
  setTimeout(() => {
    map.getCanvas().style.cursor = "";
    if (popup) {
      popup.remove();
    }
  }, 500);
};

// Function to handle the mouse enter event
export const handleMouseEnter = async (
  popup: mapboxgl.Popup,
  zipCode: string,
  map: mapboxgl.Map,
  bounds: mapboxgl.LngLatBounds,
  toast: any
) => {
  if (zipCode) {
    try {
      const weatherData = await fetchWeatherData(zipCode);
      if (weatherData) {
        const coordinates = bounds.getCenter();
        const popupContent = `
          <strong>Location:</strong> ${weatherData.location.name}<br>
          <strong>Temperature:</strong> ${weatherData.current.temp_c} °C<br>
          <strong>Time:</strong> ${new Date(weatherData.location.localtime).toLocaleTimeString()}`;
        popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
      }
    } catch (error) {
      toast({
        title: "Error fetching weather data",
        description: "Please try again later",
      });
      console.error("Error fetching weather data:", error);
    }
  }
};

// Function to calculate bounds from GeoJSON coordinates
export const calculateBounds = (geojson: any) => {
  const bounds = new mapboxgl.LngLatBounds();
  const coordinates = geojson.features[0].geometry?.coordinates[0];
  for (const coord of coordinates) {
    bounds.extend([coord[0], coord[1]]);
  }
  return bounds;
};
