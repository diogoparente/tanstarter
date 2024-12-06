import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "~/server/db";
import { user as userTable } from "~/server/db/schema";
import { RegisterInput, registerSchema } from "~/lib/auth";

export const Route = createAPIFileRoute("/api/auth/register")({
  POST: async ({ request }) => {
    const body = (await request.json()) as RegisterInput;

    const { email, password, name } = body;

    // Check if user already exists
    const existingUser = await db
      ?.select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (existingUser?.[0]) {
      return json({ message: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create user
      const result = await db
        ?.insert(userTable)
        .values({
          email,
          password: hashedPassword,
          name,
        })
        .returning();

      if (!result?.[0]) {
        return json({ message: "Failed to create user" }, { status: 500 });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = result[0];

      return json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Failed to register user:", error);
      return json({ message: "Failed to register user" }, { status: 500 });
    }
  },
});
