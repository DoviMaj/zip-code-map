export interface Coordinate {
  lng: number;
  lat: number;
}

export interface Polygon {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface GeoJsonFeature {
  type: string;
  properties: Record<string, any>;
  geometry: Polygon;
}

export interface GeoJsonData {
  type: string;
  features: GeoJsonFeature[];
}
