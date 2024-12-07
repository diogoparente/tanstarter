import { createAPIFileRoute } from "@tanstack/start/api";
import { OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";
import { parseCookies } from "vinxi/http";
import {
  createSession,
  generateSessionToken,
  github,
  setSessionTokenCookie,
} from "~/server/auth";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";

interface GitHubUser {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string;
  location: string | null;
  login: string;
}

export const Route = createAPIFileRoute("/api/auth/callback/github")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookies = parseCookies();
    const storedState = cookies.github_oauth_state;

    if (!code || !state || !storedState || state !== storedState) {
      return new Response(null, {
        status: 400,
      });
    }

    const PROVIDER_ID = "github";

    try {
      const tokens = await github.validateAuthorizationCode(code);
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      });

      if (!githubUserResponse.ok) {
        throw new Error("Failed to get user info");
      }

      const providerUser: GitHubUser = await githubUserResponse.json();

      if (!providerUser.email) {
        throw new Error("Email is required");
      }

      const existingUser = await db.query.user.findFirst({
        where: and(
          eq(user.provider, PROVIDER_ID),
          eq(user.provider_user_id, providerUser.id),
        ),
      });

      let userId: number;

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const existingUserEmail = await db.query.user.findFirst({
          where: eq(user.email, providerUser.email),
        });

        if (existingUserEmail) {
          // Link provider to existing account
          const updateResult = await db
            .update(user)
            .set({
              provider: PROVIDER_ID,
              provider_user_id: providerUser.id,
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
            .insert(user)
            .values({
              email: providerUser.email,
              name: providerUser.name || providerUser.login,
              avatar_url: providerUser.avatar_url,
              provider: PROVIDER_ID,
              provider_user_id: providerUser.id,
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
