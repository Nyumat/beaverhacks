import { mutation } from "./_generated/server";
import { v } from "convex/values";

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
