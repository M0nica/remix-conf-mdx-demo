import type {
	LoaderArgs,
	MetaFunction,
	HeadersFunction,
	SerializeFrom,
} from "@vercel/remix";
import { json, redirect } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react'
import { parseISO, format } from 'date-fns';
import * as React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

import invariant from "tiny-invariant";

import { MarkdownView } from "~/components/Markdown";
import { parseMarkdown } from "~/utils/mdx-bundler.server";
 import { getContent } from "~/utils/blog.server";

import { CacheControl } from "~/utils/cache-control.server";
import { getSeoMeta, getSeoLinks } from "~/seo";
;

export const loader = async ({params}: LoaderArgs) => {
	let path = params["*"];

	invariant(path, "BlogPost: path is required");

	if (!path) {
		throw new Error('path is not defined')
	}    

	// const files = await getContent(`docs/${path}`);
	// let post = files && parseMarkdown(files[0].content);
	const files = await getContent(`docs/${path}`);

	let post = files && (await parseMarkdown(files[0].content));
	// if (!post) {
	// 	throw json({}, {
	// 		status: 404, headers: {}
	// 	})
	// }    

	//invariant(post, "Not found");
	if (!post) {
		throw json({}, {
			status: 404, headers:  {}
		})
	}    

	return json({post}, {
		headers: { 
			"Cache-Control": new CacheControl("swr").toString() 
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

export const links = () => {
	let seoLinks = getSeoLinks();
	return [...seoLinks];
};

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
