import { useEffect, useState, MutableRefObject, useRef } from "react";
import mapboxgl from "mapbox-gl";

export const useMapInstance = (
  mapContainerRef: MutableRefObject<HTMLDivElement | null>
) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [map, setMap] = useState<any>();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      zoom: 1,
      center: [31.771959, 35.217018],
    });

    setMap(map);

    // Cleanup function to remove the map
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);
  return { map };
};
