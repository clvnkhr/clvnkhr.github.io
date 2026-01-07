import { Post, PostMetadata } from '../types/post.js';
import { extractColorsFromHtml } from '../utils/svg-colors.js';

  export function parseMetadata(content: string): PostMetadata {
  const metadata: Record<string, any> = {};
  const commentBlock = content.match(/^\/\/.*$/gm);

  commentBlock?.forEach((line) => {
    const parts = line.replace('// ', '').split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();

      if (key === 'title') {
        return;
      } else if (key === 'tags') {
        metadata[key] = value.split(',').map((t: string) => t.trim());
      } else if (key === 'updated') {
        const dates = value.split(',').map((d: string) => d.trim()).filter(Boolean);
        metadata.updated = dates.length > 0 ? dates.map((d: string) => new Date(d)) : undefined;
      } else if (key === 'draft') {
        metadata[key] = value === 'true';
      } else if (key === 'hidden') {
        metadata[key] = value === 'true';
      } else if (key === 'date') {
        const dates = value.split(',').map((d: string) => d.trim()).filter(Boolean);
        if (dates.length > 0) {
          metadata[key] = new Date(dates[0]);
          if (dates.length > 1) {
            const additionalDates = dates.slice(1).map((d: string) => new Date(d));
            if (!metadata.updated) {
              metadata.updated = additionalDates;
            } else {
              metadata.updated = [...metadata.updated, ...additionalDates];
            }
          }
        }
      } else {
        metadata[key] = value;
      }
    }
  });

  return metadata as PostMetadata;
}

export async function compileTypst(typstFile: string): Promise<{
  html: string;
  svgColors: string[];
}> {
  const fontPath = 'fonts/LeteSansMath';
  const result = await Bun.$`typst compile --format html --features html --root .. --font-path ${fontPath} ${typstFile} -`.quiet();
  const html = result.stdout.toString();

  const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
  if (!bodyMatch) {
    throw new Error(`Could not find body tag in Typst output for ${typstFile}`);
  }

  const htmlContent = bodyMatch[1].trim();
  const svgColors = extractColorsFromHtml(htmlContent);

  return { html: htmlContent, svgColors };
}
