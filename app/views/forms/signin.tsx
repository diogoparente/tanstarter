import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema, login } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const CredentialSignIn = () => {
  const navigate = useNavigate();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Logged in successfully");
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      toast.error("Failed to login", {
        description: error.message,
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="email@example.com" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          aria-label="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    aria-label="password"
                    type="password"
                    autoComplete="on"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

const SocialSignIn = () => {
  return (
    <form method="GET" className="flex items-center gap-4">
      <Button
        formAction="/api/auth/github"
        className="flex-1"
        type="submit"
        variant="outline"
      >
        Sign in with GitHub
      </Button>
      <Button
        formAction="/api/auth/google"
        className="flex-1"
        type="submit"
        variant="outline"
      >
        Sign in with Google
      </Button>
    </form>
  );
};

export function SignInForm() {
  return (
    <div>
      <CredentialSignIn />
      <hr className="my-4" />
      <SocialSignIn />
    </div>
  );
}
