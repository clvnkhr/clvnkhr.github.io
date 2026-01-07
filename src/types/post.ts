export interface PostMetadata {
  title: string;
  date: Date;
  updated?: Date[];
  tags: string[];
  description?: string;
  splash?: string;
  draft?: boolean;
  hidden?: boolean;
}

export interface Post extends PostMetadata {
  slug: string;
  path: string;
  htmlContent: string;
  svgColors?: string[];
}
