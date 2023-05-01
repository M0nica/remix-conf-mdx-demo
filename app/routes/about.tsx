import type {
	LoaderArgs,
	MetaFunction,
	HeadersFunction,
	SerializeFrom,
} from "@vercel/remix";
import { json } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react'

import invariant from "tiny-invariant";
import { getContent } from "~/utils/blog.server";
import { CacheControl } from "~/utils/cache-control.server";
import { getSeoMeta } from "~/seo"; 
import * as React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

import { MarkdownView } from "~/components/Markdown";
import { parseMarkdown } from "~/utils/mdx-bundler.server";

export const loader = async ({params}: LoaderArgs) => {
	const files = await getContent(`pages/about`);
	let post = files && await parseMarkdown(files[0].content);

	invariant(post, "Not found");

	return json({post}, {
		headers: {
			"Cache-Control": new CacheControl("swr").toString(),
		}
	})
}

export const headers: HeadersFunction = ({loaderHeaders}) => {
	return {
		'Cache-Control': loaderHeaders.get('Cache-Control')!
	}
}

export const meta: MetaFunction = ({data}) => {
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

export default function BlogPost() {

	const { post } = useLoaderData<typeof loader>();

	const { code } = post;

	const Component = React.useMemo(() => getMDXComponent(code), [code]);



	return (
		<article className='prose prose-zinc mx-auto min-h-screen max-w-4xl pt-24 dark:prose-invert lg:prose-lg'>
			<Component />
		</article>
	);
}
