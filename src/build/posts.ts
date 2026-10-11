import { Effect, Stream } from "effect";
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
  const lines = content.replace(/^\uFEFF/, '').split('\n');

  let date: Date | undefined;
  let tags: string[] | undefined;
  const updateValues: string[] = [];
  let draft: boolean | undefined;
  let hidden: boolean | undefined;
  let description: string | undefined;
  let splash: string | undefined;
  let splash_caption: string | undefined;

  const parseDate = (value: string): Date | undefined => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
      ? parsed
      : undefined;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === '') continue;
    if (!line.startsWith('//') && !line.startsWith('#import')) {
      break;
    }

    if (!line.startsWith('//')) {
      continue;
    }

    const parts = line.slice(2).split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();

      if (key === 'title') {
        continue;
      } else if (key === 'tags') {
        tags = Array.from(new Set(value.split(',').map((t) => t.trim()).filter(Boolean)));
        if (tags.some((tag) => /[/\\]/.test(tag) || tag === '.' || tag === '..')) {
          return Effect.fail(new MetadataParseError('tags', 'Tags must not contain path separators or be dot segments'));
        }
      } else if (key === 'updated') {
        const dates = value.split(',').map((d: string) => d.trim()).filter(Boolean);
        updateValues.push(...dates);
      } else if (key === 'draft') {
        if (value !== 'true' && value !== 'false') {
          return Effect.fail(new MetadataParseError('draft', 'Expected true or false'));
        }
        draft = value === 'true';
      } else if (key === 'hidden') {
        if (value !== 'true' && value !== 'false') {
          return Effect.fail(new MetadataParseError('hidden', 'Expected true or false'));
        }
        hidden = value === 'true';
      } else if (key === 'date') {
        const dates = value.split(',').map((d: string) => d.trim()).filter(Boolean);
        if (dates.length > 0) {
          date = parseDate(dates[0]);
          if (!date) {
            return Effect.fail(new MetadataParseError('date', `Invalid date: ${dates[0]}; expected YYYY-MM-DD`));
          }
          updateValues.push(...dates.slice(1));
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

  const updated: Date[] = [];
  for (const value of new Set(updateValues)) {
    const updateDate = parseDate(value);
    if (!updateDate) {
      return Effect.fail(new MetadataParseError('updated', `Invalid update date: ${value}; expected YYYY-MM-DD`));
    }
    updated.push(updateDate);
  }
  updated.sort((a, b) => a.getTime() - b.getTime());

  return Effect.succeed<PostMetadata>({
    title: "",
    date,
    tags,
    updated: updated.length > 0 ? updated : undefined,
    draft,
    hidden,
    description,
    splash,
    splash_caption,
  });
}

const typstHtmlCompatibilityPreamble = `#let overline = math.macron`;

export const prepareTypstSourceForHtml = (content: string) =>
  // Typst 0.15 drops `overline` during MathML export, while `math.macron`
  // emits the same visual accent as a proper <mover>.
  `${typstHtmlCompatibilityPreamble}\n\n${content}`;

export const compileTypst = (typstFile: string, content: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const path = yield* Path;

    const dir = path.dirname(typstFile);
    const basename = path.basename(typstFile);
    const tmpFile = path.join(dir, `.tmp_${basename}`);

    yield* fs.writeFileString(tmpFile, prepareTypstSourceForHtml(content));

    const rawHtml = yield* Effect.scoped(Effect.gen(function* () {
      const process = yield* Command.start(
        Command.make("typst", "compile", "--format", "html", "--features", "html", "--root", "..", tmpFile, "-"),
      );
      // Drain both pipes while waiting for exit so verbose errors cannot block the process.
      const [html, stderr, code] = yield* Effect.all([
        Stream.runFold(Stream.decodeText(process.stdout), '', (text, chunk) => text + chunk),
        Stream.runFold(Stream.decodeText(process.stderr), '', (text, chunk) => text + chunk),
        process.exitCode,
      ], { concurrency: 'unbounded' });
      if (code !== 0) {
        const details = stderr.trim();
        return yield* Effect.fail(new TypstCompileFailed(typstFile, `Typst exited with code ${code}${details ? `: ${details}` : ''}`));
      }
      return html;
    })).pipe(
      Effect.catchAll((e) =>
        Effect.fail(e instanceof TypstCompileFailed ? e : new TypstCompileFailed(typstFile, String(e))),
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

const matchingDelimiters: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "|": "|",
  "‖": "‖",
  "⟨": "⟩",
  "⌊": "⌋",
  "⌈": "⌉",
};

const tallMathMlPattern = /<m(?:frac|root|sqrt|table|under|underover)\b|[∫∑∏]/;

const withStretchyFalse = (attrs: string) =>
  /\bstretchy=/.test(attrs) ? attrs : ` stretchy="false"${attrs}`;

const normalizeMathMlFenceContent = (content: string) => {
  const match = content.match(
    /^<mo\b([^>]*)>([()[\]{}|‖⟨⟩⌊⌋⌈⌉])<\/mo>([\s\S]*)<mo\b([^>]*)>([()[\]{}|‖⟨⟩⌊⌋⌈⌉])<\/mo>$/,
  );

  if (!match) {
    return content;
  }

  const [, openAttrs, open, inner, closeAttrs, close] = match;
  if (matchingDelimiters[open] !== close || tallMathMlPattern.test(inner)) {
    return content;
  }

  return `<mo${withStretchyFalse(openAttrs)}>${open}</mo>${inner}<mo${withStretchyFalse(closeAttrs)}>${close}</mo>`;
};

const normalizeSimpleMathMlFences = (html: string) => {
  const parseUntilMrowClose = (index: number): [string, number] => {
    let result = "";
    let cursor = index;

    while (cursor < html.length) {
      const nextMrow = html.indexOf("<mrow", cursor);
      const nextClose = html.indexOf("</mrow>", cursor);

      if (nextClose !== -1 && (nextMrow === -1 || nextClose < nextMrow)) {
        result += html.slice(cursor, nextClose);
        return [result, nextClose + "</mrow>".length];
      }

      if (nextMrow === -1) {
        result += html.slice(cursor);
        return [result, html.length];
      }

      result += html.slice(cursor, nextMrow);
      const openEnd = html.indexOf(">", nextMrow);
      if (openEnd === -1) {
        result += html.slice(nextMrow);
        return [result, html.length];
      }

      const openTag = html.slice(nextMrow, openEnd + 1);
      const [inner, afterClose] = parseUntilMrowClose(openEnd + 1);
      result += `${openTag}${normalizeMathMlFenceContent(inner)}</mrow>`;
      cursor = afterClose;
    }

    return [result, cursor];
  };

  return parseUntilMrowClose(0)[0];
};

const normalizeMathMlDelimiters = (html: string) =>
  normalizeSimpleMathMlFences(
    html.replace(
      /<mo\b(?![^>]*\bstretchy=)(?=[^>]*\b[lr]space=)([^>]*)>([()[\]{}|‖⟨⟩⌊⌋⌈⌉])<\/mo>/g,
      '<mo stretchy="false"$1>$2</mo>',
    ),
  );

const normalizeMathMlOverlineAccents = (html: string) =>
  html.replace(/<mover accent="true">([\s\S]*?)<mo>̄<\/mo><\/mover>/g, '<mover accent="true">$1<mo>¯</mo></mover>');

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
    htmlContent = normalizeMathMlDelimiters(htmlContent);
    htmlContent = normalizeMathMlOverlineAccents(htmlContent);
    htmlContent = normalizeTheoremFigures(htmlContent);
    const svgColors = extractColorsFromHtml(htmlContent);
    return { html: htmlContent, svgColors };
  });
