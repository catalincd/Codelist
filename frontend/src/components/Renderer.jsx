import ReactMarkdown from 'react-markdown'
import React, { useContext, useState, useEffect } from "react"
import { BlockMath, InlineMath } from 'react-katex'
import remarkGfm from "remark-gfm"
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import CodeRenderer from "./CodeRenderer"
import 'katex/dist/katex.min.css'

const markdown = `The lift coefficient ($C_L$) is a dimensionless coefficient.`

const Renderer = (props) => {

    const newProps = {
        ...props,
        remarkPlugins: [
            remarkGfm,
            remarkMath
        ],
        rehypePlugins: [
            rehypeKatex
        ],
        components: {
            ...props.renderers,
            math: (props) => <BlockMath>{props.value}</BlockMath>,
            inlineMath: (props) => <InlineMath>{props.value}</InlineMath>,
            code: (props) => <CodeRenderer {...props} />
        }
    };
    return (
        <Markdown {...newProps} />
    );
}

export default Renderer