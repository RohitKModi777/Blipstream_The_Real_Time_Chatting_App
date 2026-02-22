"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ConversationPage() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.id as Id<"conversations">;

    const conversation = useQuery(api.conversations.getConversation, {
        conversationId,
    });
    const messages = useQuery(api.messages.listMessages, { conversationId });
    const typingUsers = useQuery(api.typing.getTypingUsers, { conversationId });
    const markAsRead = useMutation(api.messages.markAsRead);
    const sendMessage = useMutation(api.messages.sendMessage);
    const setTyping = useMutation(api.typing.setTyping);

    // Mark messages as read when the conversation opens
    useEffect(() => {
        if (conversationId) {
            markAsRead({ conversationId });
        }
    }, [conversationId, markAsRead]);

    if (conversation === undefined || messages === undefined) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
        );
    }

    if (conversation === null) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-950">
                <p className="text-slate-400">Conversation not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-950">
            <ChatHeader
                conversation={{
                    _id: conversation._id,
                    name: conversation.otherUser?.name ?? "Unknown",
                    imageUrl: conversation.otherUser?.imageUrl,
                    isOnline: conversation.otherUser?.isOnline,
                    isGroup: false
                }}
                onBack={() => router.push("/chat")}
            />
            <MessageList
                messages={messages}
                typingUsers={typingUsers}
            />
            <MessageInput
                onSend={(content) => sendMessage({ conversationId, content })}
                onTyping={(isTyping) => setTyping({ conversationId, isTyping })}
            />
        </div>
    );
}
