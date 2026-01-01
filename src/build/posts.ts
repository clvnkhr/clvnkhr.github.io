import { Post, PostMetadata } from '../types/post.js';

export function parseMetadata(content: string): PostMetadata {
  const metadata: Record<string, any> = {};
  const commentBlock = content.match(/^\/\/.*$/gm);

  commentBlock?.forEach((line) => {
    const parts = line.replace('// ', '').split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();

      if (key === 'tags') {
        metadata[key] = value.split(',').map((t: string) => t.trim());
      } else if (key === 'date' || key === 'updated') {
        metadata[key] = new Date(value);
      } else if (key === 'draft') {
        metadata[key] = value === 'true';
      } else {
        metadata[key] = value;
      }
    }
  });

  return metadata as PostMetadata;
}

export async function compileTypst(typstFile: string): Promise<string> {
  const fontPath = 'fonts/LeteSansMath';
  const result = await Bun.$`typst compile --format html --features html --root ../../../../ --font-path ${fontPath} ${typstFile} -`.quiet();
  const html = result.stdout.toString();

  const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
  if (!bodyMatch) {
    throw new Error(`Could not find body tag in Typst output for ${typstFile}`);
  }

  return bodyMatch[1].trim();
}
