'use client';

import { useState } from 'react';

export function useMapPanel() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  return {
    selectedRegionId,
    openPanel: setSelectedRegionId,
    closePanel: () => setSelectedRegionId(null),
  };
}
