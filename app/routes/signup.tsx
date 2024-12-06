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
import { SignUpForm } from "~/views/forms/register";
import { ROUTES } from "../routes";

export const Route = createFileRoute(ROUTES.SIGN_UP)({
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
            <CardTitle className="text-center text-2xl md:text-3xl">Register</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-6 text-center">
              <p className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Already have an account?</span>
                <Button variant="link" asChild className="p-0">
                  <Link href={ROUTES.SIGN_IN}>Login</Link>
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
