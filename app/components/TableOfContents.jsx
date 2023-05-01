export function TableOfContents({ headings }) {
    if (!headings) return <></>

    return (
        <>
            <h2> Table of Contents</h2>
            <ul>{headings.map(({ id, text }) =>
                    id && text ?
                        <li key={id}>
                            <a href={`#${id}`} >{text}</a>
                        </li>
                        : <></>
                )}
            </ul>
        </>)
}