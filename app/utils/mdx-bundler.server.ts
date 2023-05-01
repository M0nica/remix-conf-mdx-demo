import { bundleMDX } from "mdx-bundler";
// import { Callout, Fence, QuickLink, QuickLinks } from '~/components/Markdown';
import calculateReadingTime from "reading-time";

export async function parseMarkdown(markdown: string) {
  const { default: a11yEmoji } = await import("@fec/remark-a11y-emoji");

  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );

  const { default: remarkSlug } = await import("remark-slug");

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
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ];

      return options;
    },
  });

  const readTime = calculateReadingTime(code);

  // console.log('we are returning ', {
  //   frontmatter,
  //   readTime,
  //   code,
  //   body: code,
  // })
  
  return {
    frontmatter,
    readTime,
    code,
    body: code,
  };
}
