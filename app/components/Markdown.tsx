/*
This file handles all our MDX components rendering on the frontend.
*/

import * as React from "react";
import Highlight, { defaultProps } from 'prism-react-renderer'
import type { ReactNode } from "react";
import { Link } from "@remix-run/react";

import {
	LightBulbIcon,
	ExclamationTriangleIcon,
	CheckIcon,
} from '@heroicons/react/24/solid'

import cn from 'classnames'

const callOutStyles = {
	note: {
		container: 'bg-sky-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
		title: 'text-sky-900 dark:text-sky-400',
		icon: 'text-sky-900 dark:text-sky-400',
		body: 'text-sky-800 [--tw-prose-background:theme(colors.sky.50)] prose-a:text-sky-900 prose-code:text-sky-900 dark:text-slate-300 dark:prose-code:text-slate-300',
	},
	warning: {
		container: 'bg-amber-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
		title: 'text-amber-900 dark:text-amber-500',
		icon: 'text-amber-900 dark:text-amber-500',
		body: 'text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-slate-300 dark:[--tw-prose-underline:theme(colors.sky.700)] dark:prose-code:text-slate-300',
	},
	success: {
		container: 'bg-green-50 dark:bg-green-800/60 dark:ring-1 dark:ring-green-300/10',
		title: 'text-green-900 dark:text-green-400',
		icon: 'text-green-900 dark:text-green-400',
		body: 'text-green-800 [--tw-prose-background:theme(colors.green.50)] prose-a:text-green-900 prose-code:text-green-900 dark:text-green-300 dark:prose-code:text-green-300',
	},
}

const icons = {
	note: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => <LightBulbIcon {...props} />,
	warning: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => <ExclamationTriangleIcon {...props} />,
	success: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => <CheckIcon {...props} />,
}
  
type Types = "check" | "error" | "note" | "warning";

type CalloutProps = { 
	children: ReactNode; 
	title?: string;
	type: Types 
};

type QuickLinksProps = { 
	children: ReactNode; 
};

type QuickLinkProps = { 
	title: string;
	description: string;
	href: string;
};

/* Wrap links in Markup that identifies external links that will open in a new window and use Remix Links for internal links */
export const CustomLink = (props: {
	href: string;
	children?: React.ReactNode;
}) => {
	const {href} = props;
	const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'))
	return isInternalLink ? <Link to={href} prefetch="intent" {...props} /> : <>
		<a {...props} target="_blank" rel="noopener noreferrer" />
		<span className="sr-only">(opens in a new tab)</span>
	</>  
}

const Paragraph = (props: Props): JSX.Element => {

	if (typeof props.children !== 'string') {
		return <>{props.children}</>
	}

	return <> <p {...props} /><p>✨Sparkles Powered By: MDX✨</p></>
}


  

export function QuickLinks({ children }: QuickLinksProps) {
	return (
	  <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
		{children}
	  </div>
	)
}
  
QuickLinks.scheme = {
	render: QuickLinks.name,
	description: "Display the enclosed content in a box",
};  


export function QuickLink({ title, description, href }: QuickLinkProps) {
	return (
		<div className="group relative rounded-xl border border-slate-200 dark:border-slate-800">
			<div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
			<div className="relative overflow-hidden rounded-xl p-6">
				<h2 className="mt-4 font-display text-base text-slate-900 dark:text-white">
					<CustomLink href={href}>
						<span className="absolute -inset-px rounded-xl" />
						{title}
					</CustomLink>
				</h2>
				<p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
					{description}
				</p>
			</div>
		</div>
	)
}


export function Callout({ children, title, type }: CalloutProps) {
  let IconComponent = icons[type]
  return (
    <div className={cn('my-8 flex rounded-3xl p-6', callOutStyles[type]?.container)}>
		<IconComponent className={cn('mt-4 h-8 w-8 flex-none', callOutStyles[type].icon)} />
		<div className="ml-4 flex-auto">
			{title && <p className={cn('m-0 font-display text-xl', callOutStyles[type].title)}>
				{title}
			</p>}
			<div className={cn('prose mt-2.5', callOutStyles[type].body)}>
				{children}
			</div>
		</div>
    </div>
  );
}


type FenceProps = { 
	children: ReactNode; 
	language?: string;
};

export function Fence({ children, language }: FenceProps) {
	return (
	  <Highlight
		{...defaultProps}
		code={children.trimEnd()}
		language={language}
		theme={undefined}
	  >
		{({ className, style, tokens, getTokenProps }) => (
				<pre className={cn('whitespace-pre-wrap',className)} style={style}>
			<code>
			  {tokens.map((line, lineIndex) => (
				<React.Fragment key={lineIndex}>
				  {line
					.filter((token) => !token.empty)
					.map((token, tokenIndex) => (
					  <span key={tokenIndex} {...getTokenProps({ token })} />
					))}
				  {'\n'}
				</React.Fragment>
			  ))}
			</code>
		  </pre>
		)}
	  </Highlight>
	)
  }

Fence.scheme = {
	render: Fence.name,
	description: "Highlight block of code",
	children: ["pre", "code"],
	attributes: {
		language: {
			type: String,
			description: 'The programming language of the code block. Place it after the backticks.'
		}
	},
  };
  


