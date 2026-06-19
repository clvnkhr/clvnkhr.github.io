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

class MetadataParseError {
  readonly _tag = "MetadataParseError";
  constructor(
    readonly field: string,
    readonly message: string,
  ) {}
}

export function parseMetadata(content: string): Effect.Effect<PostMetadata, MetadataParseError> {
  const lines = content.split('\n');

  let date: Date | undefined;
  let tags: string[] | undefined;
  let updated: Date[] | undefined;
  let draft: boolean | undefined;
  let hidden: boolean | undefined;
  let description: string | undefined;
  let splash: string | undefined;
  let splash_caption: string | undefined;

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
        tags = value.split(',').map((t: string) => t.trim());
      } else if (key === 'updated') {
        const dates = value.split(',').map((d: string) => d.trim()).filter(Boolean);
        updated = dates.length > 0 ? dates.map((d: string) => new Date(d)) : undefined;
      } else if (key === 'draft') {
        draft = value === 'true';
      } else if (key === 'hidden') {
        hidden = value === 'true';
      } else if (key === 'date') {
        const dates = value.split(',').map((d: string) => d.trim()).filter(Boolean);
        if (dates.length > 0) {
          date = new Date(dates[0]);
          if (dates.length > 1) {
            const additionalDates = dates.slice(1).map((d: string) => new Date(d));
            if (updated) {
              updated = [...updated, ...additionalDates];
            } else {
              updated = additionalDates;
            }
          }
        }
      } else if (key === 'description') {
        description = value;
      } else if (key === 'splash') {
        splash = value;
      } else if (key === 'splash_caption') {
        splash_caption = value;
      }
    }
  }

  if (!date) {
    return Effect.fail(new MetadataParseError("date", "Missing required date field"));
  }

  return Effect.succeed<PostMetadata>({
    title: "",
    date,
    tags,
    updated,
    draft,
    hidden,
    description,
    splash,
    splash_caption,
  });
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

const theoremFigureCaptionPattern =
  /<figcaption>\s*<strong>\s*(Example|Theorem|Remark|Definition|Corollary|Lemma|Proof)\b[\s\S]*?<\/strong>\s*<\/figcaption>/;

const normalizeTheoremFigures = (html: string) =>
  html.replace(
    /<figure([^>]*)>\s*<div>\s*([\s\S]*?)\s*<\/div>\s*<\/figure>/g,
    (match: string, attrs: string, inner: string) => {
      if (!theoremFigureCaptionPattern.test(inner)) {
        return match;
      }

      const divAttrs = attrs.trim();
      const attrText = divAttrs ? ` ${divAttrs}` : "";
      const normalizedInner = inner
        .replace(/<figcaption>/g, '<span class="typst-theorem-label">')
        .replace(/<\/figcaption>/g, "</span>");

      return `<div${attrText} class="typst-theorem">
      <div>
        ${normalizedInner.trim()}
      </div>
    </div>`;
    },
  );

export const processTypstOutput = (typstFile: string, rawHtml: string) =>
  Effect.gen(function* () {
    const bodyMatch = rawHtml.match(/<body>([\s\S]*?)<\/body>/);
    if (!bodyMatch) {
      return yield* Effect.fail(new TypstCompileFailed(typstFile, "Could not find body tag in Typst output"));
    }
    let htmlContent = bodyMatch[1].trim();
    // Replace #000000 on <use> elements with currentColor to work around
    // mobile Safari not cascading CSS fill through <use> shadow DOM to <symbol> paths
    htmlContent = htmlContent
      .replace(/(<use[^>]*?)\sfill="#000000"/g, '$1 fill="currentColor"')
      .replace(/(<use[^>]*?)\sstroke="#000000"/g, '$1 stroke="currentColor"');
    htmlContent = normalizeTheoremFigures(htmlContent);
    const svgColors = extractColorsFromHtml(htmlContent);
    return { html: htmlContent, svgColors };
  });
