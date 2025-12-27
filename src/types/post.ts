export interface Post {
  id: string;
  title: string;
  date: string;
  updated?: string;
  tags: string[];
  description: string;
  htmlContent: string;
  pin?: boolean;
  splashImage?: string;
  author?: string;
}

export interface Filters {
  query?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}
