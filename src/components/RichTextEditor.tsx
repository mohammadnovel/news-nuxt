"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useCreateBlockNote({
    initialContent: value ? JSON.parse(value) : undefined,
  });

  const handleChange = () => {
    const blocks = editor.document;
    onChange(JSON.stringify(blocks));
  };

  return (
    <div className="border rounded-md">
      <BlockNoteView 
        editor={editor} 
        onChange={handleChange}
        theme="light"
      />
    </div>
  );
}
