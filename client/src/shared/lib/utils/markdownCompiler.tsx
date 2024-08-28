import React from "react";
import MessageLink from "@/shared/ui/MessageLink";
import { CompilerOptions, PartOfCompilerUse } from "@/shared/model/types";
import { compiler } from "markdown-to-jsx";

const defaultHandlingForRaw: Required<Pick<CompilerOptions, 'createElement' | 'shouldStayRaw'>> = {
    shouldStayRaw: ['a'],
    createElement(tag, props, ...children) {
        return this.shouldStayRaw.includes(tag) ? <React.Fragment key={props.key}>{children}</React.Fragment> : React.createElement(tag, props, ...children);
    }
}

const compilerRules: Record<PartOfCompilerUse, CompilerOptions> = {
    message: { overrides: { a: { component: MessageLink } } },
    reply: { ...defaultHandlingForRaw },
    feed: { ...defaultHandlingForRaw },
    messageTopBar: { ...defaultHandlingForRaw }
}

export const markdownCompiler = (markdown: string, part: PartOfCompilerUse, options?: CompilerOptions) => {
    return compiler(markdown, { wrapper: null, ...compilerRules[part], ...options });
}