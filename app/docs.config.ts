export default {
    base: '/',
	lang: 'en-US',
    title: 'Remix Docs',
    description: 'Just playing around.',
    nav: [
        { text: 'Docs', link: '/docs' },
        { text: 'Blog', link: '/blog' },
    ],
    head: [

    ],
    sidebar: [
        {
            title: 'Introduction',
            links: [
                { title: 'About', href: '/docs/about' },
                { title: 'Installation', href: '/docs/installation' },
            ],
        },
        {
            title: 'Core Concepts',
            links: [
                { title: 'Table of Contents 101', href: '/docs/why-toc' },
            ],
        },
    ],
    search: {
        enabled: true,
    },
    editLink: {
        enabled: true,
        link: 'https://github.com/m0nica/remix-mdx-docs',
        text: 'Edit this page on GitHub',
    },
};