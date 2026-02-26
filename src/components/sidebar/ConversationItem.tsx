"use client";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatConversationTime, truncate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
    conversation: {
        _id: string;
        otherUser: {
            _id: string;
            name: string;
            imageUrl: string;
            isOnline: boolean;
        } | null;
        lastMessage: {
            content: string;
            isDeleted: boolean;
        } | null;
        lastMessageTime?: number;
        unreadCount: number;
    };
}

export function ConversationItem({ conversation }: ConversationItemProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = pathname === `/chat/${conversation._id}`;

    const { otherUser, lastMessage, lastMessageTime, unreadCount } = conversation;

    const previewText = lastMessage
        ? lastMessage.isDeleted
            ? "This message was deleted"
            : truncate(lastMessage.content, 45)
        : "Start a conversation";

    return (
        <button
            onClick={() => router.push(`/chat/${conversation._id}`)}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-all text-left",
                isActive && "bg-black/5 dark:bg-white/10 border-l-2 border-purple-500 shadow-md dark:shadow-lg dark:shadow-black/20"
            )}
        >
            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={otherUser?.imageUrl} />
                    <AvatarFallback className="bg-secondary text-foreground text-sm">
                        {otherUser?.name?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                </Avatar>
                {otherUser?.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-border" />
                )}
            </div>

            {/* Name and preview */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm truncate">
                        {otherUser?.name ?? "Unknown"}
                    </span>
                    {lastMessageTime && (
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">
                            {formatConversationTime(lastMessageTime)}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                    <p
                        className={cn(
                            "text-xs truncate",
                            lastMessage?.isDeleted
                                ? "text-muted-foreground italic"
                                : "text-muted-foreground"
                        )}
                    >
                        {previewText}
                    </p>
                    {unreadCount > 0 && (
                        <Badge className="ml-1 flex-shrink-0 bg-purple-600 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full px-1">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </div>
            </div>
        </button>
    );
}
