import { createAPIFileRoute } from "@tanstack/start/api";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { user as userTable } from "~/server/db/schema";
import bcrypt from "bcrypt";
import { createSession, generateSessionToken, SESSION_COOKIE_NAME } from "~/server/auth";
import { json } from "@tanstack/start";

interface LoginParams {
  email: string;
  password: string;
}

export const Route = createAPIFileRoute("/api/auth/login")({
  POST: async ({ request }) => {
    try {
      const { email, password } = (await request.json()) as LoginParams;

      if (!email || !password) {
        return json({ message: "Email and password are required" }, { status: 400 });
      }

      const users = await db.select().from(userTable).where(eq(userTable.email, email));
      const user = users?.[0];

      if (!user) {
        return json({ message: "Invalid email or password" }, { status: 401 });
      }

      if (!user.password) {
        return json({ message: "Account requires OAuth login" }, { status: 401 });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return json({ message: "Invalid email or password" }, { status: 401 });
      }

      // Generate session token and create session
      const sessionToken = generateSessionToken();
      console.log("Session token:", sessionToken);

      const session = await createSession(sessionToken, user.id);
      console.log("Session created:", session);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Create response with json utility
      const response = json({ user: userWithoutPassword });

      // Set the cookie in the response headers
      const cookieValue = `${SESSION_COOKIE_NAME}=${sessionToken}; HttpOnly; Path=/; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      } Expires=${session.expires_at.toUTCString()}`;

      response.headers.set("Set-Cookie", cookieValue);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return json({ message: "Authentication failed" }, { status: 500 });
    }
  },
});
