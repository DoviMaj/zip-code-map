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
      setLoading(true);
      // Fake data for testing
      const geojson = FakeBoundaries as any;
      // const geojson = await fetchZipCodeBoundaries(zipCode);
      setBoundariesData(geojson);
      setLoading(false);
    };
    if (!zipCode) return;
    fetchData();
  }, [zipCode]);

  return { boundariesData, loading };
};
