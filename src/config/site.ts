import { Context, Layer } from "effect";

export type SiteConfig = {
  title: string;
  description: string;
  repository: string;
  author: { name: string };
  navigation: Array<{ label: string; href: string }>;
};

export const site: SiteConfig = {
  title: "Calvin Khor",
  description: "Personal blog about mathematics, programming, and technology",
  repository: "https://github.com/clvnkhr/clvnkhr.github.io",
  author: {
    name: "Calvin Khor",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Mathematics", href: "/blog/2023/06/09/mathematics/" },
    { label: "Blog", href: "/blog/" },
    { label: "Projects", href: "/tags/projects/" },
    { label: "Tags", href: "/tags/" },
  ],
};

export class SiteConfigTag extends Context.Tag("SiteConfig")<
  SiteConfigTag,
  SiteConfig
>() {
  static readonly Live = Layer.succeed(SiteConfigTag, site);
}
