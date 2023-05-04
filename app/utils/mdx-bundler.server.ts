import { bundleMDX } from "mdx-bundler";
import a11yEmoji from "@fec/remark-a11y-emoji";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug"
// import remarkGfm from 'remark-gfm'
import calculateReadingTime from "reading-time";
import remarkHeadings from "./parseHeadings";
;
export async function parseMarkdown(markdown: string) {

let headings = []

  const { frontmatter, code } = await bundleMDX({ 
    source: markdown,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        a11yEmoji,
        // remarkGfm
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap"}], [remarkHeadings, {
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
