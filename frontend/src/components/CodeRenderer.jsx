import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import rehypeMermaid from 'rehype-mermaid'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import Mermaid from "react-mermaid2"

const CodeRenderer = (props) => {
    const { children, className, node, ...rest } = props
    const match = /language-(\w+)/.exec(className || '')

    return (
        match ? <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={dark}
        /> : <code className={className}>{children}</code>
    )
}


const MermaidRenderer = (props) => {

    return <Mermaid chart={props.children} />
}


export default CodeRenderer