import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { asyncMap } from "convex-helpers";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendFile = mutation({
  args: {
    storageId: v.id("_storage"),
    userId: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("files", {
      body: args.storageId,
      userId: args.userId,
      format: "file",
      sessionId: args.sessionId,
    });
  },
});

export const deleteById = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.storageId);
  },
});

export const getFiles = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const samples = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    return await asyncMap(samples, async (sample) => ({
      ...sample,
      filePath: await ctx.storage.getUrl(sample.body),
    }));
  },
});
