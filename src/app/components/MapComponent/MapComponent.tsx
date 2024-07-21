"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./styles.module.css";
import { useBoundariesData } from "../../../hooks/useBoundariesData.hook";
import { useMapInstance } from "../../../hooks/useMapInstance.hook";
import { updateBoundingBox } from "./utils";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZG92aW1haiIsImEiOiJjbHl2ZnR0MWoxZmZjMnFxN2ZjaWJ6M3BrIn0.7uJGpXGSpk8n4ZQCk525FA";

interface MapComponentProps {
  zipCode: string;
}

export default function MapComponent() {
  const searchParams = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  const counter = searchParams.get("c");

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { map } = useMapInstance(mapContainerRef);
  const { boundariesData } = useBoundariesData(zipcode as string);

  useEffect(() => {
    if (!boundariesData) return;
    updateBoundingBox(map, boundariesData);
  }, [boundariesData, zipcode, counter]);

  return <div ref={mapContainerRef} className={styles.mapContainer}></div>;
}
