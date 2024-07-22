import { useEffect, useState } from "react";
import FakeBoundaries from "../FakeData/zipcode-boundary.geojson.json";
import { GeoJsonData } from "../interfaces";
import { fetchZipCodeBoundaries } from "@/lib/api.utils";

export const useBoundariesData = (
  zipCode: string
): {
  boundariesData: GeoJsonData | null;
  loading: boolean;
} => {
  const [boundariesData, setBoundariesData] = useState<GeoJsonData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fake data for testing
        // let geojson = FakeBoundaries as any;
        const geojson = await fetchZipCodeBoundaries(zipCode);

        setBoundariesData(geojson);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    if (!zipCode) return;
    fetchData();
  }, [zipCode]);

  return { boundariesData, loading };
};
