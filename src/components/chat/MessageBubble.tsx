"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatMessageTime } from "@/lib/formatters";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢"];

interface MessageBubbleProps {
    message: any;
    prevMessage: any | null;
    isGroup?: boolean;
}

export function MessageBubble({ message, prevMessage, isGroup }: MessageBubbleProps) {
    const { user } = useUser();
    const [showActions, setShowActions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Dynamic mutations based on context
    const deleteDM = useMutation(api.messages.deleteMessage);
    // Groups delete not strictly required but could be added
    const toggleDMReaction = useMutation(api.messages.toggleReaction);
    const toggleGroupReaction = useMutation(api.groups.toggleGroupReaction);

    const currentUser = useQuery(api.users.getCurrentUser);

    const isOwn = message.sender?.clerkId === user?.id;
    const isSameSenderAsPrev = prevMessage && prevMessage.senderId === message.senderId;
    const showAvatar = !isOwn && !isSameSenderAsPrev;

    const reactionGroups = (message.reactions ?? []).reduce((acc: any, r: any) => {
        acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
        return acc;
    }, {});

    const myReactions = new Set((message.reactions ?? [])
        .filter((r: any) => r.userId === currentUser?._id)
        .map((r: any) => r.emoji));

    const handleToggleReaction = (emoji: string) => {
        if (isGroup) {
            toggleGroupReaction({ messageId: message._id, emoji });
        } else {
            toggleDMReaction({ messageId: message._id, emoji });
        }
    };

    return (
        <div
            className={cn(
                "flex items-end gap-2 group",
                isOwn ? "flex-row-reverse" : "flex-row",
                isSameSenderAsPrev ? "mt-0.5" : "mt-3"
            )}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => {
                setShowActions(false);
                setShowEmojiPicker(false);
            }}
        >
            <div className="w-8 flex-shrink-0">
                {showAvatar ? (
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={message.sender?.imageUrl} />
                        <AvatarFallback className="bg-secondary text-foreground text-xs">
                            {message.sender?.name?.charAt(0).toUpperCase() ?? "?"}
                        </AvatarFallback>
                    </Avatar>
                ) : null}
            </div>

            <div className={cn("max-w-[70%] flex flex-col", isOwn && "items-end")}>
                {!isOwn && !isSameSenderAsPrev && (
                    <p className="text-xs text-[var(--text-secondary)] mb-1 px-1">
                        {message.sender?.name}
                    </p>
                )}

                <div className="flex items-center gap-1" style={{ flexDirection: isOwn ? "row-reverse" : "row" }}>
                    {showActions && !message.isDeleted && (
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker((v) => !v)}
                                className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors text-base"
                            >
                                😊
                            </button>
                            {showEmojiPicker && (
                                <div className={cn(
                                    "absolute bottom-8 flex gap-1 bg-popover rounded-full px-2 py-1 shadow-xl border border-border z-10",
                                    isOwn ? "right-0" : "left-0"
                                )}>
                                    {EMOJI_LIST.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => {
                                                handleToggleReaction(emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            className={cn("text-lg hover:scale-125 transition-transform", myReactions.has(emoji) && "opacity-50")}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {isOwn && showActions && !message.isDeleted && !isGroup && (
                        <button
                            onClick={() => deleteDM({ messageId: message._id })}
                            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}

                    <div className={cn(
                        "rounded-2xl px-3.5 py-1.5 text-sm leading-relaxed break-words shadow-sm backdrop-blur-sm",
                        isOwn
                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm ml-auto shadow-purple-500/10"
                            : "bg-[var(--bubble-received)] border border-[var(--bubble-received-border)] text-foreground rounded-bl-sm mr-auto",
                        message.isDeleted && "opacity-60 italic bg-slate-900/50 border border-white/5"
                    )}>
                        {message.isDeleted
                            ? <span className="text-slate-500 text-xs">This message was deleted</span>
                            : message.content
                        }
                    </div>
                </div>

                {Object.keys(reactionGroups).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 px-1">
                        {Object.entries(reactionGroups).map(([emoji, count]) => (
                            <button
                                key={emoji as string}
                                onClick={() => handleToggleReaction(emoji as string)}
                                className={cn(
                                    "flex items-center gap-1 bg-secondary/50 border rounded-full px-2 py-0.5 text-xs hover:bg-secondary transition-colors",
                                    myReactions.has(emoji as string) ? "border-purple-500 text-purple-600 dark:text-purple-300" : "border-border text-muted-foreground"
                                )}
                            >
                                <span>{emoji as string}</span>
                                <span>{count as number}</span>
                            </button>
                        ))}
                    </div>
                )}

                <span className="text-[10px] text-[var(--text-secondary)] mt-0.5 px-1">
                    {formatMessageTime(message._creationTime)}
                </span>
            </div>
        </div>
    );
}
