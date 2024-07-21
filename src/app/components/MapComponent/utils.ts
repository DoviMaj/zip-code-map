import { GeoJsonData } from "../../../interfaces";
import mapboxgl from "mapbox-gl";

const LAYER_ID = "zipcode-boundary";

export const updateBoundingBox = async (
  map: any,
  boundariesData: GeoJsonData
) => {
  const geojson = boundariesData as any;

  function checkIfMapboxStyleIsLoaded() {
    if (map.isStyleLoaded()) {
      return true;
    } else {
      return false;
    }
  }

  const updateLayer = () => {
    map.getSource("fill")?.setData(geojson);

    if (!map.getLayer(LAYER_ID)) {
      map.addLayer({
        id: LAYER_ID,
        type: "fill",
        source: {
          type: "geojson",
          data: geojson,
        },
        paint: {
          "fill-color": "#888888",
          "fill-opacity": 0.6,
        },
      });
    }

    // Calculate bounds from GeoJSON coordinates
    const bounds = new mapboxgl.LngLatBounds();

    // Extend bounds with coordinates from GeoJSON
    const coordinates = geojson.features[0].geometry.coordinates[0];
    for (const coord of coordinates) {
      bounds.extend([coord[0], coord[1]]);
    }

    // Fit map to the bounds
    map.fitBounds(bounds, {
      padding: 20,
      maxZoom: 10,
    });
  };

  if (checkIfMapboxStyleIsLoaded()) {
    updateLayer();
  } else {
    setTimeout(function () {
      updateLayer();
    }, 1000);
  }
};
