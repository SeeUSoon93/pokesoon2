export type BiomeRegion = {
  id: string;
  name: string;
  center?: {
    lat: number;
    lng: number;
  };
  geometry?: unknown;
  biomeType: string;
  predictedPokemon: string[];
  confidence: number;
  createdAt?: string;
  updatedAt?: string;
};
