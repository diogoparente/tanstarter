"use client";
import { Link, useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toogle";
import { Button } from "../ui/button";
import { logout } from "~/lib/auth";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const user = null;
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate({ to: "/signin" });
  };

  return (
    <div className="flex h-16 border-b">
      <div className="mx-4 my-2 flex w-full items-center justify-between">
        <Link to="/" className="text-sm font-medium text-foreground hover:underline">
          Home
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-foreground hover:underline"
            >
              Login
            </Link>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </div>
  );
};

export { Header };
