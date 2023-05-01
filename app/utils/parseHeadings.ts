export default function remarkHeadings(options) {
    return async function transform(tree: M.Root) {
        const { visit } = await import('unist-util-visit');

        visit(
            tree, { type: 'element', tagName: "h2" },
            function visitor(node) {
                const { properties, children } = node;
                const anchor = children.find((child) => child.tagName === "a")
                const anchorText = anchor.children.find((child) => child.type === 'text').value
                if (anchorText && properties?.id)
                    options.exportRef.push({
                        id: properties?.id,
                        text: anchorText
                    })
            },
        )
    }
}
