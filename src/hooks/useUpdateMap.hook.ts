import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import {
  calculateBounds,
  handleMouseEnter,
  handleMouseLeave,
  updateBoundingBox,
} from "../lib/map.utils";
import { GeoJsonData } from "../interfaces";

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

    const handleMouseEnterCallback = () =>
      handleMouseEnter(popup, zipcode, map, bounds);
    const handleMouseLeaveCallback = () => handleMouseLeave(popup, map);

    map.on("mouseenter", LAYER_ID, handleMouseEnterCallback);
    map.on("mouseleave", LAYER_ID, handleMouseLeaveCallback);

    return () => {
      map.off("mouseenter", LAYER_ID, handleMouseEnterCallback);
      map.off("mouseleave", LAYER_ID, handleMouseLeaveCallback);
      popup.remove();
    };
  }, [boundariesData, zipcode, counter, map]);
};
