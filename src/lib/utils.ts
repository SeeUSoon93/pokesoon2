export function cn(...classNames: Array<string | false | null | undefined>): string {
  return classNames.filter(Boolean).join(' ');
}

export function formatDateLabel(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR');
}
