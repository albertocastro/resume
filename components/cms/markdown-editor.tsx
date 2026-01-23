"use client"

import { memo, useEffect, useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ListsToggle,
  InsertThematicBreak,
  CreateLink,
  BlockTypeSelect,
} from "@mdxeditor/editor"

type MarkdownEditorProps = {
  label: string
  value: string
  onChange: (next: string) => void
  hint?: string
  minRows?: number
  className?: string
}

function MarkdownEditorComponent({ label, value, onChange, hint, className }: MarkdownEditorProps) {
  const [localValue, setLocalValue] = useState(value)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/70 shadow-sm">
        <MDXEditor
          markdown={localValue}
          onChange={(next) => {
            setLocalValue(next)
            startTransition(() => onChange(next))
          }}
          className="mdxeditor"
          contentEditableClassName="min-h-[240px] px-4 py-4 text-base leading-relaxed text-foreground"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <div className="flex flex-wrap items-center gap-2">
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <ListsToggle />
                  <InsertThematicBreak />
                  <CreateLink />
                </div>
              ),
            }),
          ]}
        />
      </div>
    </div>
  )
}

export const MarkdownEditor = memo(MarkdownEditorComponent)
MarkdownEditor.displayName = "MarkdownEditor"
