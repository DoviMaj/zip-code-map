import { useEffect, useState, MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";

export const useMapInstance = (
  mapContainerRef: MutableRefObject<HTMLDivElement | null>
) => {
  const [map, setMap] = useState<mapboxgl.Map | undefined>();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      zoom: 1,
      center: [-98.583333, 40],
    });

    map.addControl(new mapboxgl.NavigationControl());

    setMap(map);
  }, [mapContainerRef]);

  return { map };
};
