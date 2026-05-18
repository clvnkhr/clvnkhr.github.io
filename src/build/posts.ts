import { Effect } from "effect";
import { Command } from "@effect/platform";
import { PostMetadata } from '../types/post.js';
import { extractColorsFromHtml } from '../utils/svg-colors.js';

const toError = (e: unknown) => e instanceof Error ? e : new Error(String(e));

  export function parseMetadata(content: string): PostMetadata {
  const metadata: Record<string, any> = {};

  const lines = content.split('\n');

  for (const line of lines) {
    if (!line.startsWith('//') && !line.startsWith('#import')) {
      break;
    }

    if (!line.startsWith('//')) {
      continue;
    }

    const parts = line.replace('// ', '').split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();

      if (key === 'title') {
        continue;
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
  }

  return metadata as PostMetadata;
}

export const compileTypst = (typstFile: string) =>
  Command.string(
    Command.make("typst", "compile", "--format", "html", "--features", "html", "--root", "..", "--font-path", "fonts/LeteSansMath", typstFile, "-"),
  ).pipe(
    Effect.flatMap((html) =>
      Effect.try({
        try: () => {
          const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
          if (!bodyMatch) throw new Error(`Could not find body tag in Typst output for ${typstFile}`);
          const htmlContent = bodyMatch[1].trim();
          const svgColors = extractColorsFromHtml(htmlContent);
          return { html: htmlContent, svgColors };
        },
        catch: toError,
      }),
    ),
    Effect.catchAll((e) => Effect.fail(e instanceof Error ? e : new Error(String(e)))),
  );
