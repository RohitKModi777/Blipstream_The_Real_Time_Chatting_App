import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./helpers";

// Create a group conversation
export const createGroup = mutation({
    args: {
        name: v.string(),
        memberIds: v.array(v.id("users")),
    },
    handler: async (ctx, { name, memberIds }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Ensure creator is included
        const allMembers = Array.from(new Set([userId, ...memberIds]));

        return await ctx.db.insert("groups", {
            name,
            members: allMembers,
            createdBy: userId,
            lastMessageTime: Date.now(),
        });
    },
});

// List all groups the current user is a member of
export const listGroups = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const allGroups = await ctx.db.query("groups").collect();
        const myGroups = allGroups.filter((g) => g.members.includes(userId));

        const enriched = await Promise.all(
            myGroups.map(async (group) => {
                const lastMessage = group.lastMessageId
                    ? await ctx.db.get(group.lastMessageId)
                    : null;

                // Count unread
                const messages = await ctx.db
                    .query("groupMessages")
                    .withIndex("by_group", (q) => q.eq("groupId", group._id))
                    .collect();

                const unreadCount = messages.filter(
                    (m) => !m.readBy.includes(userId) && m.senderId !== userId
                ).length;

                return {
                    ...group,
                    lastMessage,
                    unreadCount,
                    memberCount: group.members.length,
                };
            })
        );

        return enriched.sort(
            (a, b) => (b.lastMessageTime ?? 0) - (a.lastMessageTime ?? 0)
        );
    },
});

// Get a single group
export const getGroup = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, { groupId }) => {
        const userId = await getAuthUserId(ctx);
        const group = await ctx.db.get(groupId);
        if (!group || !group.members.includes(userId!)) return null;

        const members = await Promise.all(group.members.map((id) => ctx.db.get(id)));
        return { ...group, members: members.filter(Boolean) };
    },
});

// List messages in a group
export const listGroupMessages = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, { groupId }) => {
        const messages = await ctx.db
            .query("groupMessages")
            .withIndex("by_group", (q) => q.eq("groupId", groupId))
            .order("asc")
            .collect();

        const enriched = await Promise.all(
            messages.map(async (msg) => {
                const sender = await ctx.db.get(msg.senderId);
                return { ...msg, sender };
            })
        );

        return enriched;
    },
});

// Send message to a group
export const sendGroupMessage = mutation({
    args: {
        groupId: v.id("groups"),
        content: v.string(),
    },
    handler: async (ctx, { groupId, content }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const group = await ctx.db.get(groupId);
        if (!group || !group.members.includes(userId)) throw new Error("Not a member");

        const messageId = await ctx.db.insert("groupMessages", {
            groupId,
            senderId: userId,
            content: content.trim(),
            isDeleted: false,
            readBy: [userId],
            reactions: [],
        });

        await ctx.db.patch(groupId, {
            lastMessageId: messageId,
            lastMessageTime: Date.now(),
        });

        return messageId;
    },
});

// Toggle reaction on a group message
export const toggleGroupReaction = mutation({
    args: {
        messageId: v.id("groupMessages"),
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
            reactions.splice(existingIndex, 1);
        } else {
            reactions.push({ userId, emoji });
        }

        await ctx.db.patch(messageId, { reactions });
    },
});

// Mark group messages as read
export const markGroupAsRead = mutation({
    args: { groupId: v.id("groups") },
    handler: async (ctx, { groupId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return;

        const messages = await ctx.db
            .query("groupMessages")
            .withIndex("by_group", (q) => q.eq("groupId", groupId))
            .collect();

        await Promise.all(
            messages
                .filter((m) => !m.readBy.includes(userId))
                .map((m) =>
                    ctx.db.patch(m._id, { readBy: [...m.readBy, userId] })
                )
        );
    },
});
