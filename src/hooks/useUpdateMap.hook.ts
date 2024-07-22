import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import {
  calculateBounds,
  handleMouseEnter,
  handleMouseLeave,
  updateBoundingBox,
} from "../utils/map.utils";
import { GeoJsonData } from "../interfaces";
import { fetchWeatherData } from "../utils/api.utils";
import { useToast } from "../components/ui/use-toast";

const LAYER_ID = "zipcode-boundary";

interface UseUpdateMapProps {
  zipcode: string | null;
  map: mapboxgl.Map | undefined;
  boundariesData: GeoJsonData | null;
  counter: string | null;
}

export const useUpdateMap = ({
  zipcode,
  map,
  boundariesData,
  counter,
}: UseUpdateMapProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!boundariesData || !map || !zipcode) return;

    updateBoundingBox(map, boundariesData);

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    const bounds = calculateBounds(boundariesData);

    map.fitBounds(bounds, {
      padding: 20,
      maxZoom: 15,
    });

    const handleMouseEnter = async (
      popup: mapboxgl.Popup,
      zipCode: string,
      map: mapboxgl.Map,
      bounds: mapboxgl.LngLatBounds
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

    const handleMouseEnterCallback = () =>
      handleMouseEnter(popup, zipcode, map, bounds);
    const handleMouseLeaveCallback = () => handleMouseLeave(popup, map);

    map.on("mouseenter", LAYER_ID, handleMouseEnterCallback);
    map.on("move", LAYER_ID, handleMouseLeaveCallback);

    return () => {
      map.off("mouseenter", LAYER_ID, handleMouseEnterCallback);
      map.off("move", LAYER_ID, handleMouseLeaveCallback);
      popup.remove();
    };
  }, [boundariesData, zipcode, counter, map]);
};
