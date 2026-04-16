import { BiomeReport } from '@/types/report';

export function mapReportSummary(report: BiomeReport) {
  return `${report.observedPokemon.join(', ')} / ${report.rating}점`;
}
