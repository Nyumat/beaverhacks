"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { Icons } from "./icons";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);
  return (
    <div>
      <input
        type="checkbox"
        id="toggle"
        className="hidden"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
      <label
        htmlFor="toggle"
        className={cn(
          "w-9 h-9 flex justify-center items-center cursor-pointer p-2 hover:bg-gray-2 rounded-lg transition-colors",
          className
        )}
      >
        <Icons.sun size={20} className="hidden dark:inline" />
        <Icons.moon size={20} className="dark:hidden" />
      </label>
    </div>
  );
}
