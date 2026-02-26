"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, AlertCircle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
    onSend: (content: string) => Promise<any>;
    onTyping: (isTyping: boolean) => Promise<any>;
    placeholder?: string;
}

export function MessageInput({ onSend, onTyping, placeholder }: MessageInputProps) {
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTyping = useCallback(() => {
        onTyping(true).catch(() => { });
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            onTyping(false).catch(() => { });
        }, 2000);
    }, [onTyping]);

    const handleSend = async () => {
        const trimmed = content.trim();
        if (!trimmed || isSending) return;

        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        onTyping(false).catch(() => { });

        setIsSending(true);
        setError(null);
        const prevContent = content;
        setContent("");

        try {
            await onSend(trimmed);
        } catch (err) {
            setContent(prevContent);
            setError("Failed to send. Click to retry.");
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="px-4 py-3 border-t border-white/5 bg-transparent backdrop-blur-md">
            {error && (
                <div
                    onClick={handleSend}
                    className="mb-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between cursor-pointer hover:bg-red-500/20 transition-colors"
                >
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{error}</span>
                    </div>
                    <RefreshCcw className="w-3 h-3 text-red-400" />
                </div>
            )}

            <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            handleTyping();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || "Type a message..."}
                        rows={1}
                        className={cn(
                            "w-full resize-none rounded-2xl bg-secondary/30 border border-border text-foreground",
                            "placeholder:text-muted-foreground text-sm px-4 py-3 pr-4",
                            "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                            "max-h-32 overflow-y-auto transition-all"
                        )}
                        style={{ height: "auto", minHeight: "44px" }}
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = "auto";
                            el.style.height = Math.min(el.scrollHeight, 128) + "px";
                        }}
                    />
                </div>

                <Button
                    onClick={handleSend}
                    disabled={!content.trim() || isSending}
                    className="h-11 w-11 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex-shrink-0 disabled:opacity-50"
                    size="icon"
                >
                    <Send className="w-4 h-4 text-white" />
                </Button>
            </div>
        </div>
    );
}
