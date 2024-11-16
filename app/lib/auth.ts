import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export async function login({ email, password }: LoginInput) {
  return; // get users
}

export async function register({ email, password, name }: RegisterInput) {
  return; // create user
}

export async function logout() {
  // sign out
}
