export function formatDateLabel(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR');
}
