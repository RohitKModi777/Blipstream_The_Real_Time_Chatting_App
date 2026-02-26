"use client";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatConversationTime, truncate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface GroupItemProps {
    group: {
        _id: string;
        name: string;
        memberCount: number;
        lastMessage: {
            content: string;
            isDeleted: boolean;
        } | null;
        lastMessageTime?: number;
        unreadCount: number;
    };
}

export function GroupItem({ group }: GroupItemProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = pathname === `/chat/group/${group._id}`;

    const { name, memberCount, lastMessage, lastMessageTime, unreadCount } = group;

    const previewText = lastMessage
        ? lastMessage.isDeleted
            ? "This message was deleted"
            : truncate(lastMessage.content, 45)
        : "No messages yet";

    return (
        <button
            onClick={() => router.push(`/chat/group/${group._id}`)}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-all text-left",
                isActive && "bg-black/5 dark:bg-white/10 border-l-2 border-purple-500 shadow-md dark:shadow-lg dark:shadow-black/20"
            )}
        >
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm truncate">
                        {name}
                    </span>
                    {lastMessageTime && (
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">
                            {formatConversationTime(lastMessageTime)}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[10px] bg-secondary text-muted-foreground px-1 rounded flex-shrink-0">
                            {memberCount}
                        </span>
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
                    </div>
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
