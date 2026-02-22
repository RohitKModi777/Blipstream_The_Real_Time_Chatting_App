"use client";

import { ConversationItem } from "./ConversationItem";
import { GroupItem } from "./GroupItem";
import { MessageSquare, Users } from "lucide-react";

interface ConversationListProps {
    conversations: any[];
    groups: any[];
    isLoading: boolean;
}

export function ConversationList({
    conversations,
    groups,
    isLoading,
}: ConversationListProps) {
    if (isLoading) {
        return (
            <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-slate-700 rounded w-3/4" />
                            <div className="h-2 bg-slate-700 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0 && groups.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 p-6 text-center">
                <MessageSquare className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm font-medium">No conversations yet</p>
                <p className="text-slate-500 text-xs mt-1">
                    Search for someone or create a group to start chatting!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-4">
            {groups.length > 0 && (
                <div>
                    <p className="px-4 py-2 text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-3 h-3" /> Groups
                    </p>
                    {groups.map((group) => (
                        <GroupItem key={group._id} group={group} />
                    ))}
                </div>
            )}

            {conversations.length > 0 && (
                <div>
                    <p className="px-4 py-2 text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Direct Messages
                    </p>
                    {conversations.map((conv) => (
                        <ConversationItem key={conv._id} conversation={conv} />
                    ))}
                </div>
            )}
        </div>
    );
}
