import { QueryCtx, MutationCtx } from "./_generated/server";

// Helper to get the current authenticated user's ID from Convex
export async function getAuthUserId(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();

    return user?._id ?? null;
}
