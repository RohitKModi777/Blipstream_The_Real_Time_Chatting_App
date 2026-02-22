import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./helpers";

// Get all users except the current user
export const listUsers = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        const users = await ctx.db.query("users").collect();
        return users.filter((u) => u._id !== userId);
    },
});

// Get current user's profile
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(userId);
    },
});

// Get user by Clerk ID (used in webhook)
export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .unique();
    },
});

// Create or update user (called from Clerk webhook)
export const upsertUser = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx, { clerkId, name, email, imageUrl }) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { name, email, imageUrl });
            return existing._id;
        }

        return await ctx.db.insert("users", {
            clerkId,
            name,
            email,
            imageUrl,
            isOnline: false,
            lastSeen: Date.now(),
        });
    },
});

// Set user online/offline
export const setOnlineStatus = mutation({
    args: { isOnline: v.boolean() },
    handler: async (ctx, { isOnline }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return;
        await ctx.db.patch(userId, {
            isOnline,
            lastSeen: Date.now(),
        });
    },
});

// Search users by name
export const searchUsers = query({
    args: { query: v.string() },
    handler: async (ctx, { query: searchQuery }) => {
        const userId = await getAuthUserId(ctx);
        const users = await ctx.db.query("users").collect();
        const filtered = users.filter(
            (u) =>
                u._id !== userId &&
                u.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return filtered;
    },
});
