import { createAPIFileRoute } from "@tanstack/start/api";
import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/server/auth";

const PROVIDER_ID = "google";

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export const Route = createAPIFileRoute("/api/auth/callback/google")({
  GET: async ({ request }) => {
    try {
      const code = new URL(request.url).searchParams.get("code");
      if (!code) {
        throw new Error("No code provided");
      }

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for tokens");
      }

      const tokens: GoogleTokenResponse = await tokenResponse.json();

      // Get user info
      const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user info");
      }

      const providerUser: GoogleUser = await userResponse.json();

      if (!providerUser.email) {
        throw new Error("Email is required");
      }

      // Find existing user by provider ID and sub
      const existingUser = await db.query.user.findFirst({
        where: and(
          eq(user.provider, PROVIDER_ID),
          eq(user.provider_user_id, providerUser.sub),
        ),
      });

      let userId: number;

      if (existingUser) {
        // Update existing user
        const updateResult = await db
          ?.update(user)
          .set({
            name: providerUser.name,
            avatar_url: providerUser.picture,
            email_verified: true,
            updated_at: new Date(),
          })
          .where(eq(user.id, existingUser.id))
          .returning();

        if (!updateResult?.[0]) {
          throw new Error("Failed to update user");
        }

        userId = existingUser.id;
      } else {
        // Check for existing user with same email
        const existingUserEmail = await db.query.user.findFirst({
          where: eq(user.email, providerUser.email),
        });

        if (existingUserEmail) {
          // Link provider to existing account
          const updateResult = await db
            ?.update(user)
            .set({
              provider: PROVIDER_ID,
              provider_user_id: providerUser.sub,
              email_verified: true,
              updated_at: new Date(),
            })
            .where(eq(user.id, existingUserEmail.id))
            .returning();

          if (!updateResult?.[0]) {
            throw new Error("Failed to link account");
          }

          userId = existingUserEmail.id;
        } else {
          // Create new user
          const result = await db
            ?.insert(user)
            .values({
              email: providerUser.email,
              name: providerUser.name,
              avatar_url: providerUser.picture,
              provider: PROVIDER_ID,
              provider_user_id: providerUser.sub,
              email_verified: true,
            })
            .returning();

          if (!result?.[0]) {
            throw new Error("Failed to create user");
          }

          userId = result[0].id;
        }
      }

      // Create session
      const token = generateSessionToken();
      const session = await createSession(token, userId);

      if (!session) {
        throw new Error("Failed to create session");
      }

      // Set session cookie
      setSessionTokenCookie(token, session.expires_at);

      const redirectUrl = "/dashboard";
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
        },
      });
    } catch (error) {
      console.error("OAuth error:", error);
      const redirectUrl = "/signin";
      const search =
        error instanceof Error ? `error=${error.message}` : "error=Authentication failed";
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${redirectUrl}?${search}`,
        },
      });
    }
  },
});
