import { use, useEffect, useState } from "react";
import FakeBoundaries from "../FakeData/zipcode-boundary.geojson.json";
import { GeoJsonData } from "../interfaces";
import { fetchZipCodeBoundaries } from "@/lib/api.utils";
import { useToast } from "../components/ui/use-toast";

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
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fake data for testing
      const geojson = FakeBoundaries as any;

      try {
        // const geojson = await fetchZipCodeBoundaries(zipCode);
        setBoundariesData(geojson);
      } catch (error) {
        console.error("Error fetching zipcode boundaries:", error);
        toast({
          title: "Error fetching zipcode boundaries",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };
    if (!zipCode) return;
    fetchData();
  }, [zipCode]);

  return { boundariesData, loading };
};
