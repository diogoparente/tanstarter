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
import { ROUTES } from "../routes";
import { SignInForm } from "~/views/forms/signin";

export const Route = createFileRoute(ROUTES.SIGN_IN)({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
  },
});

export default function AuthPage() {
  return (
    <Page>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-auto w-full max-w-[400px]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-2xl md:text-3xl">Welcome!</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <div className="mt-6 text-center">
              <p className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Don't have an account yet?</span>
                <Button variant="link" asChild className="p-0">
                  <Link href={ROUTES.SIGN_UP}>Register</Link>
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
