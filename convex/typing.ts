import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./helpers";

// Set typing status for a user in a conversation
export const setTyping = mutation({
    args: {
        conversationId: v.id("conversations"),
        isTyping: v.boolean(),
    },
    handler: async (ctx, { conversationId, isTyping }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return;

        const existing = await ctx.db
            .query("typingStatus")
            .withIndex("by_conversation_user", (q) =>
                q.eq("conversationId", conversationId).eq("userId", userId)
            )
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { isTyping, updatedAt: Date.now() });
        } else {
            await ctx.db.insert("typingStatus", {
                conversationId,
                userId,
                isTyping,
                updatedAt: Date.now(),
            });
        }
    },
});

// Get who is typing in a conversation (excluding self)
export const getTypingUsers = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, { conversationId }) => {
        const userId = await getAuthUserId(ctx);

        const now = Date.now();
        const staleThreshold = 3000; // 3 seconds

        const typingStatuses = await ctx.db
            .query("typingStatus")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", conversationId)
            )
            .collect();

        const activeTypers = typingStatuses.filter(
            (s) =>
                s.userId !== userId &&
                s.isTyping &&
                now - s.updatedAt < staleThreshold
        );

        const enriched = await Promise.all(
            activeTypers.map(async (s) => {
                const user = await ctx.db.get(s.userId);
                return user;
            })
        );

        return enriched.filter(Boolean);
    },
});
