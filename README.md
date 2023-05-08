# Remixing MDX to Improve Content Accessibility and Usability

<img src="https://user-images.githubusercontent.com/6998954/236949872-7cf12d3b-45c8-449d-b787-df31ec6e146a.png" alt="Monica's headshot next to the text Monica Powell is speaking at Remix Conf 2023, May 9th-11th on Remixing MDX to Create More Accesible Content" width="300">

**[View presentation deck](https://slides.com/m0nica/remixmdx/)**

Markdown has become an essential tool for creating content on the web. It is a simple and easy-to-use markup language that allows users to format text using plain text syntax. However, as the complexity of the content increases, Markdown can become limiting. That's where MDX comes in. This demo site showcases the power of MDX in making Markdown more accessible! This site was created by [Monica Powell](https://aboutmonica.com) for [Remix Conf](https://remix.run/conf) and is an MDX-based fork of the [remix-docs](https://github.com/freekrai/remix-docs) stack (which uses Markdoc). The talk is an exploration of how using MDX with Remix enhances the Markdown authoring experience, unlocks an ecosystem of tools to improve accessibility & usability, and enables developers to craft more customized content experiences. This talk walksthrough multiple ways MDX can be incorporated into a Remix site and provides examples of leveraging MDX to strengthen the usability and accessibility of content.
 
Presented by: Monica Powell at Remix Conf 2023

This repo contains demo code for using MDX-bundler and Remix with:
- component shadowing
- Remark and Remix plugins
- Custom Remark plugin
- imported components 

## Resources

Documentation/Guide
- [Remix.run official MDX docs](https://remix.run/docs/en/1.16.0/guides/mdx) 
- [Table of Components](https://mdxjs.com/table-of-components/)- Table of HTML elements that can be shadowed by MDX components 
- [Building a Next-Level Code Playground / Sandbox / REPL with Sandpack](https://www.joshwcomeau.com/react/next-level-playground/)
- [External Links, New Tabs, and Accessibility / Coder’s Block](https://codersblock.com/blog/external-links-new-tabs-and-accessibility/)
- [web.dev Semantic HTML guide](https://web.dev/learn/html/semantic-html/)
- [WCAG G64: Providing a Table of Contents | Techniques for WCAG 2.0](https://www.w3.org/TR/WCAG20-TECHS/G64.html)
- [How to Make Emojis Accessible in HTML | DevYarns](https://devyarns.com/accessible-emojis/)
- [Accessible footnotes and a bit of React](https://kittygiraudel.com/2020/11/24/accessible-footnotes-and-a-bit-of-react/)

Tools:
- [unifiedjs/unified](https://github.com/unifiedjs/unified)
-[GitHub - kentcdodds/mdx-bundler: 🦤 Give me MDX/TSX strings and I’ll give you back a component you can render. Supports imports!](https://github.com/kentcdodds/mdx-bundler)
- [React Emojis - tool to copy a11y emoji markup for a given emoji](https://dreamyguy.github.io/react-emojis/)
- [GitHub - jake-low/remark-sectionize: Remark plugin to wrap each heading and the content that follows it in a `<section>` tag](https://github.com/jake-low/remark-sectionize)
- [GitHub - florianeckerstorfer/remark-a11y-emoji: Remark Plugin to make Emoji in Markdown accessible. Wraps Emoji in a <span>-Tag with role and aria-label attributes.](https://github.com/florianeckerstorfer/remark-a11y-emoji)
- [GitHub - KittyGiraudel/react-ally-footnotes](https://github.com/KittyGiraudel/react-a11y-footnotes)
- [remark/plugins.md at main · remarkjs/remark · GitHub](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [rehype/plugins.md at main · rehypejs/rehype · GitHub](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)


## Remix MDX Docs Demo 📖

Remix MDX Docs Demo is a documentation site starter.

- `content`: where mdx is stored
- `content/docs`: docs, stored as: `SLUG/index.mdx`
- `content/posts`: blog posts, stored as: `SLUG/index.mdx`
- `content/pages`: pages, stored as `SLUG/index.mdx`

The structure is based on Gatsby and gives us more flexibility, each page and post is a folder and contains an `index.mdx` file, this folder name becomes the slug.

This also gives you a lot of flexibility, for example, you can have multiple files inside one folder

- `content/posts/hello-world/index.mdx` returns as `/hello-world`
- `content/posts/hello-world/abc.mdx` returns as `/hello-world/abc`
- `content/posts/hello-world/more-hello/index.mdx` returns as `hello-world/more-hello`
- `content/posts/hello/still-hello/index.mdx` returns as `hello/still-hello`
- `content/posts/2022/test/index.mdx` returns as `/2022/test`

This lets you structure content however you want.

On build, we generate a cached json file in content (`blog-cache.json`) for all blog posts, which we then reference later for the blog index, rss, sitemap, etc.

We also generate a separate cache json file in content (`docs-cache.json`) for all docs, this can then be used for sitemap, etc as well.

Finally, we generate a separate cache json file in content (`page-cache.json`) for all pages, this can then be used for sitemap, etc as well.

Mdx files contain frontmatter which we use on the site, this frontmatter looks like:

```jsx
---
meta:
  title: Another Post
  description: A description
date: '2021-10-02T00:00:00'
updated: '2021-10-02T00:00:00'
excerpt: Hello Gaseous cloud...
headers:
  Cache-Control: no-cache
---
```

## Config

There are two parts to config, first is our env variables:

### Env Variables

By default, remix-docs will try to use the file system to read files, this works great but if you are on a hosting service like cloudflare where you can't access the file system then we need to use Github, you can configure how it accesses files in your .env file:

- `SESSION_SECRET`: Session Secret used for sessions such as dark mode
- `USE_FILESYSTEM_OR_GITHUB`: this is either `fs` or `gh`
- `GITHUB_TOKEN`: your Personal access token
- `GITHUB_OWNER`: your Github name
- `GITHUB_REPO`: your Github repo

The Github variables are only needed if `USE_FILESYSTEM_OR_GITHUB` is set to `gh`, it's `fs` by default.

### Docs Config

The second part of our config is inside the `app/docs.config.ts` file:

```js
export default {
  base: "/",
  lang: "en-US",
  title: "Remix MDX Docs Demo",
  description: "Just playing around.",
  nav: [
    { text: "Docs", link: "/docs" },
    { text: "Blog", link: "/blog" },
  ],
  head: [],
  sidebar: [
    {
      title: "Introduction",
      links: [
        { title: "Getting started", href: "/docs/getting-started" },
        { title: "Installation", href: "/docs/installation" },
      ],
    },
    {
      title: "Core Concepts",
      links: [
        { title: "Roadmap", href: "/docs/roadmap" },
        { title: "Changelog", href: "/docs/changelog" },
      ],
    },
  ],
  search: {
    enabled: true,
  },
  editLink: {
    link: "https://github.com/m0nica/remix-conf-mdx-demo",
    text: "Edit this page on GitHub",
  },
};
```

This lets you customize the top nav, sidebar links, enable search, etc.

## Available scripts

- `build` - compile and build the Remix app, Tailwind and cache blog posts into a json file in `production` mode
- `dev` - starts Remix watcher, blog cache watcher and Tawilwind CLI in watch mode

## Development

To run your Remix app locally, first, copy `.env.example` to `.env` and configure as needed following the `Config` step above.

Next, make sure your project's local dependencies are installed:

```bash
npm install
```

Afterwards, start the Remix development server like so:

```bash
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

---

## Deployment

Initially, this stack is set up for deploying to Vercel, but it can be deployed to other hosts quickly and we'll update the wiki with instructions for each.

### Vercel

Open `server.js` and save it as:

```jsx
import { createRequestHandler } from "@remix-run/vercel";
import * as build from "@remix-run/dev/server-build";
export default createRequestHandler({ build, mode: process.env.NODE_ENV });
```

Then update your `remix.config.js` file as follows:

```jsx
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "vercel",
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: ["**/.*"],
};
```

This will instruct your Remix app to use the Vercel runtime, after doing this, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```bash
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

### Netlify

Coming Soon
