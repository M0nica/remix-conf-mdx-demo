import type {
	LoaderArgs,
	MetaFunction,
	HeadersFunction,
	SerializeFrom,
} from "@vercel/remix";
import { json, redirect } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react'
import invariant from "tiny-invariant";
import { getContent } from "~/utils/blog.server";
import { CacheControl } from "~/utils/cache-control.server";
import * as React from 'react';
import { getSeoMeta, getSeoLinks } from "~/seo";
import { getMDXComponent } from 'mdx-bundler/client';
import {Fence, Callout} from "~/components/Markdown"
import type { MdxComponent } from '~/types';
import { parseMarkdown } from '~/utils/mdx-bundler.server';
import { FootnotesProvider, FootnoteRef, Footnotes } from 'react-a11y-footnotes'

export const loader = async ({params}: LoaderArgs) => {
	let path = params["*"];

   invariant(path, "BlogPost: path is required");

  if (!path) return redirect("/blog");
  if (!path) {
    throw new Error('path is not defined')
  }  

  const files = await getContent(`posts/${path}`);

  let post = files && (await parseMarkdown(files[0].content));
  if (!post) {
    throw json({}, {
      status: 404, headers: {}
    })
  }    

  return json({ post }, {
    headers: {
      "Cache-Control": new CacheControl("swr").toString()
    }
  })
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control')!,
  };
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) return {};
  let { post } = data as SerializeFrom<typeof loader>;

  let seoMeta = getSeoMeta({
    title: post.frontmatter.meta.title,
    description: post.frontmatter.meta.description,
  });
  return {
    ...seoMeta,
  };
};

export const links = () => {
  let seoLinks = getSeoLinks();
  return [...seoLinks];
};

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  const { code } = post;

  const Component = React.useMemo(() => getMDXComponent(code), [code]);



  return (
    <article className='scroll-pt-100 prose prose-zinc mx-auto min-h-screen max-w-4xl pt-24 dark:text-white dark:prose-strong:text-pink-500 lg:prose-lg'>
      <FootnotesProvider>
        <Component components={{ Fence, Callout, 
       FootnoteRef,
         Footnotes }} />
        </FootnotesProvider>  
    </article>
  );
}
