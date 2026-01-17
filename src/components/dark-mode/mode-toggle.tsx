import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/dark-mode/theme-provider";
import { useTranslation } from "react-i18next";

export function ModeToggle() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full p-2 transition-colors hover:bg-accent/20 focus:outline-none flex items-center justify-center"
      aria-label={t('common.toggleTheme')}
    >
      <div className="relative h-5 w-5 flex items-center justify-center">
        <Sun
          className={`absolute h-5 w-5 transition-all duration-300 ease-in-out text-yellow-500 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute h-5 w-5 transition-all duration-300 ease-in-out text-blue-400 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </Button>
  );
}
