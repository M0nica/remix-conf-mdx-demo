import { bundleMDX } from "mdx-bundler";

import calculateReadingTime from "reading-time";
import remarkHeadings from "./parseHeadings";
;
export async function parseMarkdown(markdown: string) {
  const { default: a11yEmoji } = await import("@fec/remark-a11y-emoji");

  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );

  const { default: remarkSlug } = await import("remark-slug");


let headings = []

  const { frontmatter, code } = await bundleMDX({ 
    source: markdown,
    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSlug,
        a11yEmoji,
        
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypeAutolinkHeadings, { behavior: "wrap" }], [remarkHeadings, {
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
