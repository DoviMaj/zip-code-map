import { useEffect, useState } from "react";
import FakeBoundaries from "../FakeData/zipcode-boundary.geojson.json";
import { GeoJsonData } from "../interfaces";

export const useBoundariesData = (
  zipCode: string | null
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

        setTimeout(() => {
          setLoading(false);
        }, 500);

        // Fake data for testing
        let geojson = FakeBoundaries as any;

        //Real Data (Uncomment to use real API)
        // const response = await axios.get(
        //   `https://vanitysoft-boundaries-io-v1.p.rapidapi.com/rest/v1/public/boundary/zipcode`,
        //   {
        //     params: { zipcode: zipCode },
        //     headers: {
        //       "x-rapidapi-host": "vanitysoft-boundaries-io-v1.p.rapidapi.com",
        //       "x-rapidapi-key":
        //         "5973e1d3ebmshd33070fdadabf88p10788cjsn699befb63255",
        //     },
        //   }
        // );

        // const geojson = response.data;

        setBoundariesData(geojson);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to fetch data");
      } finally {
        // setLoading(false);
      }
    };
    if (!zipCode) return;
    fetchData();
  }, [zipCode]);

  return { boundariesData, loading };
};
