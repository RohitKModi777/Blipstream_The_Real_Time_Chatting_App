import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./helpers";

// Get all messages in a conversation (real-time subscription)
export const listMessages = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, { conversationId }) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", conversationId)
            )
            .order("asc")
            .collect();

        // Enrich with sender info
        const enriched = await Promise.all(
            messages.map(async (msg) => {
                const sender = await ctx.db.get(msg.senderId);
                return { ...msg, sender };
            })
        );

        return enriched;
    },
});

// Send a message
export const sendMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        content: v.string(),
    },
    handler: async (ctx, { conversationId, content }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const messageId = await ctx.db.insert("messages", {
            conversationId,
            senderId: userId,
            content: content.trim(),
            isDeleted: false,
            readBy: [userId], // sender has already "read" their own message
            reactions: [],
        });

        // Update conversation's last message
        await ctx.db.patch(conversationId, {
            lastMessageId: messageId,
            lastMessageTime: Date.now(),
        });

        return messageId;
    },
});

// Mark all messages in a conversation as read
export const markAsRead = mutation({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, { conversationId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return;

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", conversationId)
            )
            .collect();

        await Promise.all(
            messages
                .filter((m) => !m.readBy.includes(userId))
                .map((m) =>
                    ctx.db.patch(m._id, {
                        readBy: [...m.readBy, userId],
                    })
                )
        );
    },
});

// Soft delete a message
export const deleteMessage = mutation({
    args: { messageId: v.id("messages") },
    handler: async (ctx, { messageId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const message = await ctx.db.get(messageId);
        if (!message || message.senderId !== userId)
            throw new Error("Unauthorized");

        await ctx.db.patch(messageId, { isDeleted: true, content: "" });
    },
});

// Add or remove a reaction
export const toggleReaction = mutation({
    args: {
        messageId: v.id("messages"),
        emoji: v.string(),
    },
    handler: async (ctx, { messageId, emoji }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const message = await ctx.db.get(messageId);
        if (!message) throw new Error("Message not found");

        const reactions = message.reactions ?? [];
        const existingIndex = reactions.findIndex(
            (r) => r.userId === userId && r.emoji === emoji
        );

        if (existingIndex >= 0) {
            // Remove reaction
            reactions.splice(existingIndex, 1);
        } else {
            // Add reaction
            reactions.push({ userId, emoji });
        }

        await ctx.db.patch(messageId, { reactions });
    },
});
