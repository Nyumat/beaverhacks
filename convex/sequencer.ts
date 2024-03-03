import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createSequenceSession = mutation({
  args: {
    samples: v.any(),
    numOfSteps: v.number(),
    checkedSteps: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const newSequenceSession = await ctx.db.insert("sessions", {
      samples: args.samples,
      numOfSteps: args.numOfSteps,
      checkedSteps: args.checkedSteps,
    });
    return newSequenceSession;
  },
});

export const deleteTrack = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const tracks = await ctx.db.query("files").collect();
    const trackToDelete = tracks.filter((track) => track.name === args.name);
    await ctx.db.delete(trackToDelete[0]?._id);
  },
});
