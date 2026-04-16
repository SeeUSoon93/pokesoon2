import { BiomeRegion } from '@/types/biome';
import { ui } from '@/lib/ui';

export function BiomeBottomSheet({
  biome,
  reportCount,
}: {
  biome?: BiomeRegion;
  reportCount: number;
}) {
  if (!biome) {
    return <p className="muted-copy">표시할 지역이 없습니다.</p>;
  }

  return (
    <div className="card-stack">
      <span className={ui.badge}>{biome.biomeType}</span>
      <h3 className="adaptive-panel__title">{biome.name}</h3>
      <p className="muted-copy">
        예상 포켓몬은 {biome.predictedPokemon.join(', ')}이고, 신뢰도는{' '}
        {Math.round(biome.confidence * 100)}%입니다.
      </p>
      {biome.center ? (
        <p className="muted-copy">
          중심 좌표 {biome.center.lat.toFixed(3)}, {biome.center.lng.toFixed(3)}
        </p>
      ) : null}
      <span className={ui.badgeWarm}>후기 {reportCount}개</span>
    </div>
  );
}
