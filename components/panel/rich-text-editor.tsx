"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  Minus,
  Pilcrow,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
};

export function RichTextEditor({ name, defaultValue = "", placeholder }: Props) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Yazmaya başlayın…" }),
    ],
    content: defaultValue || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-content min-h-[220px] max-h-[600px] overflow-auto px-4 py-3 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      const value = editor.isEmpty ? "" : editor.getHTML();
      setHtml(value);
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div className="rounded-lg border border-input bg-white overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return <div className="h-10 border-b border-input bg-slate-50" />;
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-slate-50 px-2 py-1.5">
      <Group>
        <TbBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Kalın (Cmd/Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="İtalik (Cmd/Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Altı çizili (Cmd/Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Üstü çizili"
        >
          <Strikethrough className="w-4 h-4" />
        </TbBtn>
      </Group>

      <Separator />

      <Group>
        <TbBtn
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragraf"
        >
          <Pilcrow className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Başlık 2"
        >
          <Heading2 className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Başlık 3"
        >
          <Heading3 className="w-4 h-4" />
        </TbBtn>
      </Group>

      <Separator />

      <Group>
        <TbBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Madde işaretli liste"
        >
          <List className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numaralı liste"
        >
          <ListOrdered className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Alıntı"
        >
          <Quote className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Kod bloğu"
        >
          <Code2 className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Yatay çizgi"
        >
          <Minus className="w-4 h-4" />
        </TbBtn>
      </Group>

      <Separator />

      <Group>
        <TbBtn
          onClick={() => {
            const previous = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("Bağlantı URL'si", previous ?? "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
          title="Bağlantı ekle"
        >
          <LinkIcon className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          title="Bağlantıyı kaldır"
        >
          <Unlink className="w-4 h-4" />
        </TbBtn>
      </Group>

      <Separator />

      <Group>
        <TbBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Geri al (Cmd/Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </TbBtn>
        <TbBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Yinele (Cmd/Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
        </TbBtn>
      </Group>
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Separator() {
  return <div className="mx-1 h-5 w-px bg-slate-300" />;
}

function TbBtn({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 transition-colors",
        "hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none",
        active && "bg-slate-900 text-white hover:bg-slate-900",
      )}
    >
      {children}
    </button>
  );
}
