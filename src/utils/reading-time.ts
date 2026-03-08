const WORDS_PER_MINUTE = 200;

export function getReadingTime(content: string): number {
  // Remove code blocks
  const textWithoutCode = content.replace(/```[\s\S]*?```/g, '');

  // Remove HTML tags
  const textWithoutHtml = textWithoutCode.replace(/<[^>]*>/g, '');

  // Count words
  const words = textWithoutHtml
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const minutes = Math.ceil(words.length / WORDS_PER_MINUTE);
  return Math.max(1, minutes);
}
