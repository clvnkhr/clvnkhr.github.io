import { Effect } from "effect";
import { renderToString } from 'react-dom/server';
import { HomePage } from '../components/HomePage';
import { BlogIndex } from '../components/BlogIndex';
import { PostPage } from '../components/PostPage';
import { TagPage } from '../components/TagPage';
import { TagsIndex } from '../components/TagsIndex';
import { NotFoundPage } from '../components/NotFoundPage';
import type { Post } from '../types/post';
import type { SiteConfig } from '../config/site';

export class RenderError {
  readonly _tag = "RenderError";
  constructor(
    readonly component: string,
    readonly message: string,
  ) { }
}

function render(component: string, fn: () => string): Effect.Effect<string, RenderError> {
  return Effect.try({
    try: () => `<!DOCTYPE html>${fn()}`,
    catch: (error) => new RenderError(component, String(error)),
  });
}

export function renderHomePage(siteCfg: SiteConfig, newestPost?: import('../types/post').Post): Effect.Effect<string, RenderError> {
  return render("HomePage", () => renderToString(<HomePage site={siteCfg} newestPost={newestPost} />));
}

export function renderBlogIndex(siteCfg: SiteConfig, posts: Post[]): Effect.Effect<string, RenderError> {
  return render("BlogIndex", () => renderToString(<BlogIndex site={siteCfg} posts={posts} />));
}

export function renderPostPage(siteCfg: SiteConfig, post: Post, allPosts: Post[]): Effect.Effect<string, RenderError> {
  return render("PostPage", () => renderToString(<PostPage site={siteCfg} post={post} allPosts={allPosts} />));
}

export function renderTagPage(siteCfg: SiteConfig, tagName: string, posts: Post[]): Effect.Effect<string, RenderError> {
  return render("TagPage", () => renderToString(<TagPage site={siteCfg} tagName={tagName} posts={posts} />));
}

export function renderTagsIndex(siteCfg: SiteConfig, allTags: string[], tagPosts: Record<string, number>): Effect.Effect<string, RenderError> {
  return render("TagsIndex", () => renderToString(<TagsIndex site={siteCfg} allTags={allTags} tagPosts={tagPosts} />));
}

export function renderNotFoundPage(siteCfg: SiteConfig): Effect.Effect<string, RenderError> {
  return render("NotFoundPage", () => renderToString(<NotFoundPage site={siteCfg} />));
}
