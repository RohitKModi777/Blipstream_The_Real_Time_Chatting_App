"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function GroupChatPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.id as Id<"groups">;

    const group = useQuery(api.groups.getGroup, { groupId });
    const messages = useQuery(api.groups.listGroupMessages, { groupId });
    const markAsRead = useMutation(api.groups.markGroupAsRead);

    // Mark group messages as read on open
    useEffect(() => {
        if (groupId) {
            markAsRead({ groupId });
        }
    }, [groupId, markAsRead]);

    const sendMessage = useMutation(api.groups.sendGroupMessage);

    if (group === undefined || messages === undefined) {
        return (
            <div className="flex-1 flex items-center justify-center bg-transparent">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
        );
    }

    if (group === null) {
        return (
            <div className="flex-1 flex items-center justify-center bg-transparent">
                <p className="text-slate-400">Group not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-transparent">
            <ChatHeader
                conversation={{
                    _id: group._id,
                    name: group.name,
                    imageUrl: undefined,
                    isOnline: false, // Groups don't have a single online status
                    isGroup: true,
                    memberCount: group.members.length
                }}
                onBack={() => router.push("/chat")}
            />
            <MessageList
                messages={messages}
            // Typing indicator for groups could be added but skipping for simplicity
            // or reusing the DM typing indicator logic if needed
            />
            <MessageInput
                onSend={(content) => sendMessage({ groupId, content })}
                onTyping={async (isTyping) => {
                    // Could implement group typing indicator here
                }}
                placeholder={`Message ${group.name}...`}
            />
        </div>
    );
}
