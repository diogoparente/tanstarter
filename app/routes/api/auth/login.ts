import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { user as userTable } from "~/server/db/schema";
import bcrypt from "bcrypt";

interface LoginParams {
  email: string;
  password: string;
}

export const Route = createAPIFileRoute("/api/auth/login")({
  POST: async ({ request }) => {
    const { email, password } = (await request.json()) as LoginParams;

    if (!email || !password) {
      return json({ message: "Email and password are required" }, { status: 400 });
    }

    const users = await db?.select().from(userTable).where(eq(userTable.email, email));
    const user = users?.[0];

    if (!user) {
      return json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (!user.password) {
      return json({ message: "Account requires OAuth login" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log({ isValidPassword });

    if (!isValidPassword) {
      return json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Return user
    return json({
      user: userWithoutPassword,
    });
  },
});
