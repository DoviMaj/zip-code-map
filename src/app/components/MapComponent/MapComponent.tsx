"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useBoundariesData } from "../../../hooks/useBoundariesData.hook";
import { useMapInstance } from "../../../hooks/useMapInstance.hook";
import { updateBoundingBox } from "./utils";
import { useSearchParams } from "next/navigation";

import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZG92aW1haiIsImEiOiJjbHl2ZnR0MWoxZmZjMnFxN2ZjaWJ6M3BrIn0.7uJGpXGSpk8n4ZQCk525FA";

export default function MapComponent() {
  const searchParams = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  console.log({ zipcode });
  const counter = searchParams.get("c");

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { map } = useMapInstance(mapContainerRef);
  const { boundariesData, loading } = useBoundariesData(zipcode as string);

  useEffect(() => {
    if (!boundariesData || !map || !zipcode) return;
    updateBoundingBox(zipcode as string, map, boundariesData);
  }, [boundariesData, zipcode, counter]);

  return (
    <div className="relative w-full h-screen">
      {loading && <LoadingSpinner />}
      <div ref={mapContainerRef} className="w-full h-full"></div>
    </div>
  );
}
