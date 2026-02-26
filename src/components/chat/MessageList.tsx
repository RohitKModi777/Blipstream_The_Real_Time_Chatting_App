"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { MessagesSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageListProps {
    messages: any[];
    typingUsers?: any[];
    isGroup?: boolean;
}

export function MessageList({ messages, typingUsers, isGroup }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const scrollToBottom = useCallback((smooth = true) => {
        bottomRef.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
        });
        setShowScrollButton(false);
    }, []);

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom(false);
        } else {
            setShowScrollButton(true);
        }
    }, [messages.length, isAtBottom, scrollToBottom]);

    useEffect(() => {
        scrollToBottom(false);
    }, []);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;
        const distanceFromBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight;
        setIsAtBottom(distanceFromBottom < 80);
        if (distanceFromBottom < 80) setShowScrollButton(false);
    };

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-transparent">
                <MessagesSquare className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground font-medium">No messages yet</p>
                <p className="text-muted-foreground/60 text-sm mt-1">Say hello!</p>
            </div>
        );
    }

    return (
        <div className="flex-1 relative overflow-hidden">
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
            >
                {messages.map((msg, i) => (
                    <MessageBubble
                        key={msg._id}
                        message={msg}
                        prevMessage={i > 0 ? messages[i - 1] : null}
                        isGroup={isGroup}
                    />
                ))}

                {typingUsers && typingUsers.length > 0 && (
                    <TypingIndicator users={typingUsers} />
                )}

                <div ref={bottomRef} />
            </div>

            {showScrollButton && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <Button
                        onClick={() => scrollToBottom()}
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center gap-2 rounded-full px-4 text-sm"
                    >
                        <ChevronDown className="w-4 h-4" />
                        New messages
                    </Button>
                </div>
            )}
        </div>
    );
}
