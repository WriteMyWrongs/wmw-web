"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Bold, Heading2, Italic, List, Quote } from "lucide-react";
import { toast } from "sonner";

import { savePiece } from "@/app/(app)/write/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Json, PieceStatus } from "@/types";

type EditorPiece = {
  id: string;
  title: string;
  content: Json;
  status: PieceStatus;
};

/** Only pass a stored Tiptap doc to the editor; ignore the DB's `{}` default. */
function initialContent(content: Json | undefined): JSONContent | "" {
  if (content && typeof content === "object" && "type" in content) {
    return content as JSONContent;
  }
  return "";
}

export function Editor({ piece }: { piece?: EditorPiece }) {
  const router = useRouter();
  const [pieceId, setPieceId] = useState(piece?.id);
  const [title, setTitle] = useState(piece?.title ?? "");
  const [pending, startTransition] = useTransition();
  const published = piece?.status === "published";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Tell your story…" }),
    ],
    content: initialContent(piece?.content),
    // Required for SSR — avoids a hydration mismatch (Tiptap v3 + Next).
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "editor-content min-h-[50vh] focus:outline-none" },
    },
  });

  function save(publish: boolean) {
    if (!editor) return;
    const trimmed = title.trim();
    if (!trimmed) {
      toast.error("Give your piece a title.");
      return;
    }
    startTransition(async () => {
      const res = await savePiece({
        id: pieceId,
        title: trimmed,
        content: editor.getJSON() as Json,
        contentText: editor.getText(),
        publish,
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(publish ? "Published!" : "Draft saved");
      if (publish) {
        router.push("/dashboard");
        return;
      }
      // First save of a new piece — move to its permanent URL.
      if (!pieceId && res.id) {
        setPieceId(res.id);
        router.replace(`/write/${res.id}`);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Input
        aria-label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="font-display h-auto border-0 px-0 text-3xl font-black shadow-none focus-visible:ring-0 md:text-4xl"
      />

      {editor ? (
        <>
          <div className="border-border/60 mt-4 flex flex-wrap items-center gap-1 border-y py-2">
            <ToolbarButton
              label="Bold"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold />
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic />
            </ToolbarButton>
            <ToolbarButton
              label="Heading"
              active={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 />
            </ToolbarButton>
            <ToolbarButton
              label="Bullet list"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List />
            </ToolbarButton>
            <ToolbarButton
              label="Quote"
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote />
            </ToolbarButton>
          </div>
          <EditorContent editor={editor} className="mt-6" />
        </>
      ) : (
        <p className="text-muted-foreground mt-6 text-sm">Loading editor…</p>
      )}

      <div className="mt-8 flex items-center justify-end gap-2">
        {published ? (
          <Button onClick={() => save(true)} disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => save(false)}
              disabled={pending}
            >
              {pending ? "Saving…" : "Save draft"}
            </Button>
            <Button onClick={() => save(true)} disabled={pending}>
              Publish
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(active && "bg-muted text-foreground")}
    >
      {children}
    </Button>
  );
}
