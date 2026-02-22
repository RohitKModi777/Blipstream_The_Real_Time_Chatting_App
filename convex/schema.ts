import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users synced from Clerk via webhook
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    isOnline: v.boolean(),
    lastSeen: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // One-on-one conversations
  conversations: defineTable({
    participants: v.array(v.id("users")),
    lastMessageId: v.optional(v.id("messages")),
    lastMessageTime: v.optional(v.number()),
  }),

  // DM messages
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    isDeleted: v.boolean(),
    readBy: v.array(v.id("users")),
    reactions: v.optional(
      v.array(v.object({ userId: v.id("users"), emoji: v.string() }))
    ),
  })
    .index("by_conversation", ["conversationId"]),

  // Typing status per conversation per user
  typingStatus: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_user", ["conversationId", "userId"]),

  // Group conversations (Feature 14)
  groups: defineTable({
    name: v.string(),
    members: v.array(v.id("users")),
    createdBy: v.id("users"),
    lastMessageId: v.optional(v.id("groupMessages")),
    lastMessageTime: v.optional(v.number()),
  }),

  // Group messages
  groupMessages: defineTable({
    groupId: v.id("groups"),
    senderId: v.id("users"),
    content: v.string(),
    isDeleted: v.boolean(),
    readBy: v.array(v.id("users")),
    reactions: v.optional(
      v.array(v.object({ userId: v.id("users"), emoji: v.string() }))
    ),
  })
    .index("by_group", ["groupId"]),
});
