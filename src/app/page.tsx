"use client";
import MapComponent from "../components/MapComponent/MapComponent";
import mapboxgl from "mapbox-gl";
import { SearchSection } from "../components/SearchComponents/SearchSection/SearchSection";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZG92aW1haiIsImEiOiJjbHl2ZnR0MWoxZmZjMnFxN2ZjaWJ6M3BrIn0.7uJGpXGSpk8n4ZQCk525FA";

export default function Home() {
  const searchParams = useSearchParams();
  const counter = searchParams.get("c");

  const router = useRouter();

  const changeSearchInput = (value: string) => {
    router.push(`/?zipcode=${value}&c=${counter ? Number(counter) + 1 : 1}`);
  };

  return (
    <main>
      <SearchSection changeSearchInput={changeSearchInput} />
      <MapComponent />
    </main>
  );
}
