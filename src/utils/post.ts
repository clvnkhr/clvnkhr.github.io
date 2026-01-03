export function getPostBlurb(htmlContent: string, wordCount: number = 25): string {
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const words = plainText.split(' ').slice(0, wordCount);
  const blurb = words.join(' ');

  return plainText.split(' ').length > wordCount ? `${blurb}...` : blurb;
}

export function extractTitleFromTypst(content: string): string | null {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    const headingMatch = trimmed.match(/^=\s+(.+)$/);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  }
  return null;
}

export function extractTitleFromHtml(htmlContent: string): string | null {
  const headingRegex = /<h1[^>]*>(.*?)<\/h1>/i;
  const match = htmlContent.match(headingRegex);
  return match ? match[1].replace(/<[^>]*>/g, '').trim() : null;
}

export function stripFirstHeading(htmlContent: string): string {
  const headingRegex = /<h1[^>]*>.*?<\/h1>/i;
  return htmlContent.replace(headingRegex, '');
}
