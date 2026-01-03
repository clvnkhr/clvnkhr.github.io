export function getPostBlurb(htmlContent: string, wordCount: number = 25): string {
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const words = plainText.split(' ').slice(0, wordCount);
  const blurb = words.join(' ');

  return plainText.split(' ').length > wordCount ? `${blurb}...` : blurb;
}
