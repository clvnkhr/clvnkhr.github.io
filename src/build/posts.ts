import { Effect } from "effect";
import { Command } from "@effect/platform";
import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import { PostMetadata } from '../types/post.js';
import { extractColorsFromHtml } from '../utils/svg-colors.js';

class TypstCompileFailed {
  readonly _tag = "TypstCompileFailed";
  constructor(
    readonly file: string,
    readonly message: string,
  ) {}
}

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

export const compileTypst = (typstFile: string, content: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const path = yield* Path;

    const dir = path.dirname(typstFile);
    const basename = path.basename(typstFile);
    const tmpFile = path.join(dir, `.tmp_${basename}`);

    const preamble = yield* fs.readFileString("blog/typ-templates/html-fmt-preamble.typ");
    yield* fs.writeFileString(tmpFile, preamble + "\n\n" + content);

    const rawHtml = yield* Command.string(
      Command.make("typst", "compile", "--format", "html", "--features", "html", "--root", "..", "--font-path", "fonts/LeteSansMath", tmpFile, "-"),
    ).pipe(
      Effect.catchAll((e) =>
        Effect.fail(new TypstCompileFailed(typstFile, String(e))),
      ),
      Effect.ensuring(fs.remove(tmpFile).pipe(Effect.ignore)),
    );

    return rawHtml;
  });

export const processTypstOutput = (typstFile: string, rawHtml: string) =>
  Effect.gen(function* () {
    const bodyMatch = rawHtml.match(/<body>([\s\S]*?)<\/body>/);
    if (!bodyMatch) {
      return yield* Effect.fail(new TypstCompileFailed(typstFile, "Could not find body tag in Typst output"));
    }
    const htmlContent = bodyMatch[1].trim();
    const svgColors = extractColorsFromHtml(htmlContent);
    return { html: htmlContent, svgColors };
  });
