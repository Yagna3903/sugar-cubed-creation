"use client";

import { useState, useEffect } from "react";
import { IconTrash, IconPlus } from "@tabler/icons-react";

type BlockType = "heading" | "paragraph";

interface Block {
    id: string;
    type: BlockType;
    content: string;
}

interface DynamicContentEditorProps {
    initialContent: string;
    name: string;
}

export default function DynamicContentEditor({ initialContent, name }: DynamicContentEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>([]);

    // Parse initial HTML content into blocks
    useEffect(() => {
        if (!initialContent) {
            setBlocks([{ id: crypto.randomUUID(), type: "paragraph", content: "" }]);
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(initialContent, "text/html");
        const newBlocks: Block[] = [];

        Array.from(doc.body.children).forEach((child) => {
            if (child.tagName === "H3" || child.tagName === "H2" || child.tagName === "H1") {
                newBlocks.push({
                    id: crypto.randomUUID(),
                    type: "heading",
                    content: child.textContent || "",
                });
            } else if (child.tagName === "P") {
                newBlocks.push({
                    id: crypto.randomUUID(),
                    type: "paragraph",
                    content: child.innerHTML || "", // Use innerHTML to preserve basic formatting like bold/italic if present
                });
            }
        });

        if (newBlocks.length === 0) {
            newBlocks.push({ id: crypto.randomUUID(), type: "paragraph", content: "" });
        }

        setBlocks(newBlocks);
    }, [initialContent]);

    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { id: crypto.randomUUID(), type, content: "" }]);
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter((b) => b.id !== id));
    };

    const updateBlock = (id: string, content: string) => {
        setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    };

    // Serialize blocks to HTML
    const serializedContent = blocks
        .map((block) => {
            if (block.type === "heading") {
                return `<h3>${block.content}</h3>`;
            } else {
                return `<p>${block.content}</p>`;
            }
        })
        .join("\n");

    return (
        <div className="space-y-4">
            <input type="hidden" name={name} value={serializedContent} />

            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <div key={block.id} className="group relative flex gap-2 items-start">
                        <div className="flex-1">
                            {block.type === "heading" ? (
                                <input
                                    type="text"
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                    placeholder="Section Heading"
                                    className="w-full text-lg font-bold text-brand-brown border-b-2 border-brand-brown/10 px-0 py-2 focus:border-brand-brown focus:outline-none bg-transparent placeholder:text-brand-brown/30"
                                />
                            ) : (
                                <textarea
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                    placeholder="Write your paragraph here..."
                                    rows={3}
                                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-700 focus:border-brand-brown focus:ring-1 focus:ring-brand-brown focus:outline-none resize-y"
                                />
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            title="Remove block"
                        >
                            <IconTrash size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={() => addBlock("heading")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-brand-brown/30 text-brand-brown text-sm font-medium hover:bg-brand-brown/5 transition-colors"
                >
                    <IconPlus size={16} />
                    Add Heading
                </button>
                <button
                    type="button"
                    onClick={() => addBlock("paragraph")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-zinc-300 text-zinc-600 text-sm font-medium hover:bg-zinc-50 transition-colors"
                >
                    <IconPlus size={16} />
                    Add Paragraph
                </button>
            </div>
        </div>
    );
}
