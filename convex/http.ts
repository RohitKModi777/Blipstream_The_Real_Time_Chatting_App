import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

// Clerk webhook to sync user profiles to Convex
http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("CLERK_WEBHOOK_SECRET is not set");
        }

        // Verify webhook signature using svix
        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("Missing svix headers", { status: 400 });
        }

        const payload = await request.text();
        const wh = new Webhook(webhookSecret);

        let event: { type: string; data: { id: string; email_addresses: { email_address: string }[]; first_name: string | null; last_name: string | null; image_url: string; username: string | null } };

        try {
            event = wh.verify(payload, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp,
            }) as typeof event;
        } catch {
            return new Response("Invalid webhook signature", { status: 400 });
        }

        const { type, data } = event;

        // Handle user created or updated events
        if (type === "user.created" || type === "user.updated") {
            const name =
                [data.first_name, data.last_name].filter(Boolean).join(" ") ||
                data.username ||
                "Unknown User";

            await ctx.runMutation(api.users.upsertUser, {
                clerkId: data.id,
                name,
                email: data.email_addresses[0]?.email_address ?? "",
                imageUrl: data.image_url,
            });
        }

        return new Response("OK", { status: 200 });
    }),
});

export default http;
