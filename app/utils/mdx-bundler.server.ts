import { bundleMDX } from "mdx-bundler";

import calculateReadingTime from "reading-time";
import rehypeHeadings from "./parseHeadings";
;
export async function parseMdx(mdx: string) {
  const { default: a11yEmoji } = await import("@fec/remark-a11y-emoji");

  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );

  const { default: rehypeSlug } = await import("rehype-slug");


let headings = []

  const { frontmatter, code } = await bundleMDX({ 
    source: mdx,
    /*remark-rehype — Markdown to HTML
rehype-remark — HTML to Markdown*/
//     remark — Markdown
// rehype — HTML
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        a11yEmoji,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap"}], [rehypeHeadings, {
          exportRef: headings
        }],
      ];

      return options;
    },
  });


const readTime = calculateReadingTime(code);

  return {
    headings,
    frontmatter,
    readTime,
    code,
    body: code,
  };
}
