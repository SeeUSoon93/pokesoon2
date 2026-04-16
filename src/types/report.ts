export type BiomeReport = {
  id: string;
  regionId: string;
  userUid: string;
  observedPokemon: string[];
  note: string;
  rating: number;
  visitedAt: string;
  createdAt?: string;
  updatedAt?: string;
};
