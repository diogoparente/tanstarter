import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Page } from "~/components/layout/page";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { SignInForm } from "~/views/forms/signin";

export const Route = createFileRoute("/signin")({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

export default function AuthPage() {
  return (
    <Page>
      <div className="flex min-h-screen items-center justify-center">
        {/* <div className="flex flex-col items-center gap-8 rounded-xl border bg-card p-10">
        Logo here
        <form method="GET" className="flex flex-col gap-2">
          <Button
            formAction="/api/auth/discord"
            type="submit"
            variant="outline"
            size="lg"
          >
            Sign in with Discord
          </Button>
          <Button formAction="/api/auth/github" type="submit" variant="outline" size="lg">
            Sign in with GitHub
          </Button>
          <Button formAction="/api/auth/google" type="submit" variant="outline" size="lg">
            Sign in with Google
          </Button>
        </form>
      </div> */}
        <Card className="mx-auto w-full max-w-[400px]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-2xl md:text-3xl">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <div className="mt-6 text-center">
              <p className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Don't have an account?</span>
                <Button variant="link" asChild className="p-0">
                  <Link href="/register">Register</Link>
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
