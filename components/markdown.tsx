import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

const variantClasses = {
  hero: {
    base: "text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed",
  },
  body: {
    base: "text-sm text-muted-foreground leading-relaxed",
  },
  compact: {
    base: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
  },
  modal: {
    base: "text-sm sm:text-base text-muted-foreground leading-relaxed",
  },
  editor: {
    base: "text-sm text-foreground leading-relaxed",
  },
}

type MarkdownVariant = keyof typeof variantClasses

type MarkdownProps = {
  content: string
  variant?: MarkdownVariant
  className?: string
  paragraphClassName?: string
}

export function Markdown({ content, variant = "body", className, paragraphClassName }: MarkdownProps) {
  const styles = variantClasses[variant]

  return (
    <div className={cn(className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ className: headingClassName, ...props }) => (
            <h1 className={cn("text-xl font-semibold text-foreground", headingClassName)} {...props} />
          ),
          h2: ({ className: headingClassName, ...props }) => (
            <h2 className={cn("text-lg font-semibold text-foreground", headingClassName)} {...props} />
          ),
          h3: ({ className: headingClassName, ...props }) => (
            <h3 className={cn("text-base font-semibold text-foreground", headingClassName)} {...props} />
          ),
          h4: ({ className: headingClassName, ...props }) => (
            <h4 className={cn("text-sm font-semibold text-foreground", headingClassName)} {...props} />
          ),
          p: ({ className: paragraphClassNameProp, ...props }) => (
            <p
              className={cn(
                styles.base,
                "mb-3 last:mb-0",
                paragraphClassName,
                paragraphClassNameProp,
              )}
              {...props}
            />
          ),
          strong: ({ className: strongClassName, ...props }) => (
            <strong className={cn("font-semibold text-foreground", strongClassName)} {...props} />
          ),
          em: ({ className: emClassName, ...props }) => (
            <em className={cn("italic", emClassName)} {...props} />
          ),
          a: ({ className: anchorClassName, ...props }) => (
            <a
              className={cn(
                "underline underline-offset-4 text-foreground hover:text-foreground/80",
                anchorClassName,
              )}
              {...props}
            />
          ),
          ul: ({ className: listClassName, ...props }) => (
            <ul className={cn("list-disc pl-5 space-y-1", listClassName)} {...props} />
          ),
          ol: ({ className: listClassName, ...props }) => (
            <ol className={cn("list-decimal pl-5 space-y-1", listClassName)} {...props} />
          ),
          li: ({ className: itemClassName, ...props }) => (
            <li className={cn(styles.base, itemClassName)} {...props} />
          ),
          blockquote: ({ className: quoteClassName, ...props }) => (
            <blockquote
              className={cn("border-l-2 border-border pl-4 text-muted-foreground", quoteClassName)}
              {...props}
            />
          ),
          code: ({ className: codeClassName, ...props }) => (
            <code
              className={cn(
                "rounded bg-secondary/60 px-1 py-0.5 text-xs font-mono text-foreground",
                codeClassName,
              )}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
