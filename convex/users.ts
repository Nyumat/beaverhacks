import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";

import { userValues } from "./schema";

export const createUser = internalMutation({
  args: { user: userValues },
  handler: async (ctx, args) => {
    const username = args.user.username;
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), username))
      .first();
    if (user) {
      return;
    }
    await ctx.db.insert("users", args.user);
  },
});

export const deleteUser = internalMutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = args.id;
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("id"), userId))
      .first();
    if (!user) {
      throw new ConvexError("User not found");
    }
    const id = user._id;
    await ctx.db.delete(id);
  },
});
