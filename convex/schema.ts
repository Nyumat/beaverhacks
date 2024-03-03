import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userValues = v.object({
  banned: v.boolean(),
  created_at: v.float64(),
  first_name: v.optional(v.union(v.null(), v.string())),
  has_image: v.boolean(),
  id: v.string(),
  image_url: v.string(),
  last_name: v.optional(v.union(v.null(), v.string())),
  last_sign_in_at: v.union(v.null(), v.float64()),
  username: v.optional(v.union(v.null(), v.string())),
});

export default defineSchema({
  users: defineTable({
    banned: v.boolean(),
    created_at: v.float64(),
    first_name: v.optional(v.union(v.null(), v.string())),
    has_image: v.boolean(),
    id: v.string(),
    image_url: v.string(),
    last_name: v.optional(v.union(v.null(), v.string())),
    last_sign_in_at: v.union(v.null(), v.float64()),
    username: v.optional(v.union(v.null(), v.string())),
  }).index("by_userId", ["id"]),
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  sessions: defineTable({
    samples: v.any(),
    numOfSteps: v.number(),
    checkedSteps: v.array(v.string()),
  }),
  files: defineTable({
    body: v.string(),
    name: v.string(),
    userId: v.string(),
    format: v.string(),
    sessionId: v.string(),
  }),
});
