import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook-auth",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            user: {
              id: result.data.id,
              username:
                result.data.username ??
                result.data.email_addresses[0].email_address,
              first_name: result.data.first_name,
              last_name: result.data.last_name,
              image_url: result.data.image_url,
              has_image: result.data.has_image,
              banned: result.data.banned,
              created_at: result.data.created_at,
              last_sign_in_at: result.data.last_sign_in_at,
            },
          });
          break;
        case "user.deleted":
          const userId = result.data.id as string;
          await ctx.runMutation(internal.users.deleteUser, {
            id: userId,
          });
          break;
      }
      return new Response("Webhook Success", {
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
