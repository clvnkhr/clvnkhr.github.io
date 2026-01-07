import { renderToString } from 'react-dom/server';
import { HomePage } from '../components/HomePage';
import { BlogIndex } from '../components/BlogIndex';
import { PostPage } from '../components/PostPage';
import { TagPage } from '../components/TagPage';
import { TagsIndex } from '../components/TagsIndex';
import { ProjectsPage } from '../components/ProjectsPage';
import { NotFoundPage } from '../components/NotFoundPage';
import type { Post } from '../types/post';

export function renderHomePage(): string {
  const html = renderToString(<HomePage />);
  return `<!DOCTYPE html>${html}`;
}

export function renderBlogIndex(posts: Post[]): string {
  const html = renderToString(<BlogIndex posts={posts} />);
  return `<!DOCTYPE html>${html}`;
}

export function renderPostPage(post: Post): string {
  const html = renderToString(<PostPage post={post} />);
  return `<!DOCTYPE html>${html}`;
}

export function renderTagPage(tagName: string, posts: Post[]): string {
  const html = renderToString(<TagPage tagName={tagName} posts={posts} />);
  return `<!DOCTYPE html>${html}`;
}

export function renderTagsIndex(allTags: string[], tagPosts: Record<string, number>): string {
  const html = renderToString(<TagsIndex allTags={allTags} tagPosts={tagPosts} />);
  return `<!DOCTYPE html>${html}`;
}

export function renderProjectsPage(): string {
  const html = renderToString(<ProjectsPage />);
  return `<!DOCTYPE html>${html}`;
}

export function renderNotFoundPage(): string {
  const html = renderToString(<NotFoundPage />);
  return `<!DOCTYPE html>${html}`;
}
