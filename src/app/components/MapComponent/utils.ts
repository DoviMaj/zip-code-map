import { GeoJsonData } from "../../../interfaces";
import mapboxgl from "mapbox-gl";
import axios from "axios";

export const fetchWeatherData = async (zipCode: string) => {
  const apiKey = "9a4c99157e7045b5a1f210949242107"; // Ensure to use your actual API key
  const url = `http://api.weatherapi.com/v1/current.json?q=${zipCode}&key=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const LAYER_ID = "zipcode-boundary";

export const updateBoundingBox = async (
  zipCode: string,
  map: mapboxgl.Map,
  boundariesData: GeoJsonData
) => {
  const geojson = boundariesData as any;

  function checkIfMapboxStyleIsLoaded() {
    return map.isStyleLoaded();
  }

  const updateLayer = () => {
    // Add or update the data source
    if (map.getSource(LAYER_ID)) {
      (map.getSource(LAYER_ID) as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource(LAYER_ID, {
        type: "geojson",
        data: geojson,
      });
    }

    // Add or update the layer
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

    // Calculate bounds from GeoJSON coordinates
    const bounds = new mapboxgl.LngLatBounds();
    const coordinates = geojson.features[0].geometry.coordinates[0];
    for (const coord of coordinates) {
      bounds.extend([coord[0], coord[1]]);
    }

    // Fit map to the bounds
    map.fitBounds(bounds, {
      padding: 20,
      maxZoom: 10,
    });

    // Initialize popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    // Add hover event to show popup
    map.on("mouseenter", LAYER_ID, async (e) => {
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
    });

    // Hide popup when leaving the layer
    map.on("mouseleave", LAYER_ID, () => {
      setTimeout(() => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      }, 500);
    });
  };

  if (checkIfMapboxStyleIsLoaded()) {
    updateLayer();
  } else {
    map.once("styledata", updateLayer);
  }
};
