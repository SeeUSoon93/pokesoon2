import { IvInput, IvResult } from '@/types/iv';

export function calculateIv(input: IvInput): IvResult {
  const base = Math.min(15, Math.max(0, Math.floor((input.cp + input.hp + input.level) % 16)));

  return {
    attack: base,
    defense: base,
    stamina: base,
    percent: Number(((base * 3) / 45 * 100).toFixed(1)),
  };
}
