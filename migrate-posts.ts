#!/usr/bin/env bun

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { parse as parseYaml } from 'yaml';

interface JekyllFrontmatter {
  layout: string;
  title: string;
  date: string;
  updated?: string;
  tags: string[];
  splash_img_source?: string;
  splash_img_caption?: string;
  usemathjax?: boolean;
}

function parseFrontmatter(content: string): { frontmatter: JekyllFrontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/s);
  if (!match) {
    throw new Error('Could not find frontmatter');
  }

  const frontmatter = parseYaml(match[1]) as JekyllFrontmatter;
  const body = match[2];

  return { frontmatter, body };
}

function convertFrontmatterToTypst(frontmatter: JekyllFrontmatter): string {
  let result = '';

  if (frontmatter.date) {
    const dates = [frontmatter.date];
    if (frontmatter.updated) {
      dates.push(...frontmatter.updated.split(',').map(d => d.trim()));
    }
    result += `// date: ${dates.join(', ')}\n`;
  }

  if (frontmatter.tags && frontmatter.tags.length > 0) {
    result += `// tags: ${frontmatter.tags.join(', ')}\n`;
  }

  result += '\n';

  return result;
}

function convertMarkdownToTypst(markdown: string): string {
  let text = markdown;

  text = text.replace(/<\/?[a-zA-Z][^>]*>/g, '');

  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');

  text = text.replace(/\\\[(?:.|[\s\S]*?)\\\]/g, (match) => {
    const inner = match.slice(2, -2);
    return `$${inner}$`;
  });

  text = text.replace(/\\\((?:.|[\s\S]*?)\\\)/g, (match) => {
    const inner = match.slice(2, -2);
    return `$${inner}$`;
  });

  text = text.replace(/\\\((?:.|[\s\S]*?)\\\)/g, (match) => {
    const inner = match.slice(2, -2);
    return `${inner}$`;
  });

  text = text.replace(/\\frac\{([^\}]+)\}/g, (match, args) => `frac(${args})`);
  text = text.replace(/\\mathrm\{([^\}]+)\}/g, (match, arg) => `up(${arg})`);
  text = text.replace(/\\dif\{([^\}]+)\}/g, (match, arg) => `d(${arg})`);

  text = text.replace(/^### (.+)$/gm, '=== $1');
  text = text.replace(/^## (.+)$/gm, '== $1');
  text = text.replace(/^# (.+)$/gm, '= $1');

  text = text.replace(/`{3}(\w+)\n/g, '```$1\n');
  text = text.replace(/`{3}\n([\s\S]*?)`{3}/g, (match, code) => {
    const lines = code.split('\n');
    const firstLine = lines[0];
    if (firstLine === 'typescript' || firstLine === 'javascript') {
      return '```ts\n' + lines.slice(1).join('\n') + '\n```\n';
    }
    return match;
  });

  text = text.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, (match, alt, url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return `#link("${url}")[${alt}]`;
    }
    return `#image("${url}", alt: "${alt}")`;
  });

  text = text.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, (match, alt, url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return `#link("${url}")[${alt}]`;
    }
    return `#image("${url}", alt: "${alt}")`;
  });

  text = text.replace(/(?<!\$)\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    return `#link("${url}")[${text}]`;
  });

  text = text.replace(/(?<!`)_(.+?)_/g, '_$1_');

  text = text.replace(/^> (.+)$/gm, '#quote("$1")\n');

  return text;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function getDatePath(date: string): { year: string; month: string; day: string } {
  const d = new Date(date);
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return { year, month, day };
}

function migratePost(markdownFile: string): void {
  console.log(`\n📝 Migrating: ${markdownFile}`);

  const content = readFileSync(markdownFile, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  const datePath = getDatePath(frontmatter.date);
  const slug = slugify(frontmatter.title);
  const outputPath = join('blog/posts', datePath.year, datePath.month, datePath.day, `${slug}.typ`);

  if (existsSync(outputPath)) {
    console.log(`   ⏭️  Skipping (already exists): ${outputPath}`);
    return;
  }

  const typstContent = `
// date: ${frontmatter.date}${frontmatter.updated ? `, ${frontmatter.updated}` : ''}
// tags: ${frontmatter.tags ? frontmatter.tags.join(', ') : ''}

#import "../../../../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "${frontmatter.title}")
#title()

${convertMarkdownToTypst(body).trim()}
`.trim();

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, typstContent, 'utf-8');

  console.log(`   ✅ Created: ${outputPath}`);
}

function main(): void {
  const postsDir = 'archive/_posts';

  if (!existsSync(postsDir)) {
    console.error('❌ archive/_posts directory not found');
    process.exit(1);
  }

  const mdFiles = readdirSync(postsDir)
    .filter((f: string) => f.endsWith('.md'))
    .sort();

  console.log(`\n📂 Found ${mdFiles.length} Markdown posts to migrate\n`);

  for (const mdFile of mdFiles) {
    const fullPath = join(postsDir, mdFile);
    try {
      migratePost(fullPath);
    } catch (error) {
      console.error(`   ❌ Error migrating ${mdFile}:`, error);
    }
  }

  console.log('\n✅ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Review generated .typ files');
  console.log('2. Run: bun run build');
  console.log('3. Run: bun run test');
}

main();
