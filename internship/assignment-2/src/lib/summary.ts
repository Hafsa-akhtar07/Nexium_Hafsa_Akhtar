export function generateSummary(text: string): string {
  const sentences = text.split('.').filter(Boolean);
  return sentences.slice(0, 3).join('.') + '.';
}
