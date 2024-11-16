import React, { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes"; // replace with your actual theme provider

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggleTheme}
      className={`rounded px-4 py-2 duration-300 hover:rotate-45 hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
