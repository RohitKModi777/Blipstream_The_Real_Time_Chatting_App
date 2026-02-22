import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./helpers";

// Get all conversations for the current user
export const listConversations = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const allConversations = await ctx.db.query("conversations").collect();
        const myConversations = allConversations.filter((c) =>
            c.participants.includes(userId)
        );

        // Enrich with other participant info and last message
        const enriched = await Promise.all(
            myConversations.map(async (conv) => {
                const otherId = conv.participants.find((p) => p !== userId);
                const otherUser = otherId ? await ctx.db.get(otherId) : null;

                const lastMessage = conv.lastMessageId
                    ? await ctx.db.get(conv.lastMessageId)
                    : null;

                // Count unread messages
                const messages = await ctx.db
                    .query("messages")
                    .withIndex("by_conversation", (q) =>
                        q.eq("conversationId", conv._id)
                    )
                    .collect();

                const unreadCount = messages.filter(
                    (m) => !m.readBy.includes(userId) && m.senderId !== userId
                ).length;

                return {
                    ...conv,
                    otherUser,
                    lastMessage,
                    unreadCount,
                };
            })
        );

        // Sort by last message time (most recent first)
        return enriched.sort(
            (a, b) => (b.lastMessageTime ?? 0) - (a.lastMessageTime ?? 0)
        );
    },
});

// Get or create a conversation between two users
export const getOrCreateConversation = mutation({
    args: { otherUserId: v.id("users") },
    handler: async (ctx, { otherUserId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if conversation already exists
        const allConversations = await ctx.db.query("conversations").collect();
        const existing = allConversations.find(
            (c) =>
                c.participants.includes(userId) &&
                c.participants.includes(otherUserId) &&
                c.participants.length === 2
        );

        if (existing) return existing._id;

        // Create new conversation
        return await ctx.db.insert("conversations", {
            participants: [userId, otherUserId],
            lastMessageTime: Date.now(),
        });
    },
});

// Get a single conversation by ID (with participants)
export const getConversation = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, { conversationId }) => {
        const userId = await getAuthUserId(ctx);
        const conv = await ctx.db.get(conversationId);
        if (!conv || !conv.participants.includes(userId!)) return null;

        const otherId = conv.participants.find((p) => p !== userId);
        const otherUser = otherId ? await ctx.db.get(otherId) : null;

        return { ...conv, otherUser };
    },
});
