import type { ErrorBoundaryComponent, LoaderArgs, SerializeFrom} from '@vercel/remix';
import { json} from '@vercel/remix';
import { Link,  useLoaderData } from "@remix-run/react";
import { BlogPost as BlogPostType } from '~/types';
import { getContent } from '~/utils/blog.server';
import BlogPost from '~/components/BlogPost';
import { CacheControl } from "~/utils/cache-control.server";
import { getSeoMeta } from "~/seo";
import { getMDXComponent } from 'mdx-bundler/client';

import { MarkdownView } from "~/components/Markdown";
import { parseMarkdown } from "~/utils/mdx-bundler.server";
import * as React from 'react';

export const meta = ({data}) => {
	if (!data) return {};
	let { post } = data as SerializeFrom<typeof loader>;

	let seoMeta = getSeoMeta({
		title: post.frontmatter.meta.title,
		description: post.frontmatter.meta.description,
	});
	return {
		...seoMeta,
	};
}
export let loader = async function({}: LoaderArgs) {
  const files = await getContent(`docs/index`);
  let post = files && await parseMarkdown(files[0].content);

  return json({
    post
  }, {
    headers: {
      "Cache-Control": new CacheControl("swr").toString(),
    }
  });
}


export default function Index() {
	const { post } = useLoaderData<typeof loader>();

	const { code } = post;

	const Component = React.useMemo(() => getMDXComponent(code), [code]);


	return (
		<article className='prose prose-zinc mx-auto min-h-screen max-w-4xl pt-24 dark:text-white dark:prose-strong:text-pink-500 
		lg:prose-lg'>
			<Component />
		</article>
	);
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
  return (
    <main>
      <h1>Unable to fetch list of blog posts. Please check back later</h1>
    </main>
  )
}
