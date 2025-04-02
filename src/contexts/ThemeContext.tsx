
import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure theme is only applied after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Create a context for easier theme access
const ThemeContext = createContext<ReturnType<typeof useNextThemes> | null>(null);

function useNextThemes() {
  const { theme, setTheme, systemTheme, themes } = useContext(
    NextThemesProvider.Context
  );
  
  return {
    theme,
    setTheme,
    systemTheme,
    themes,
    isDark: theme === "dark" || (theme === "system" && systemTheme === "dark"),
  };
}

export const ThemeConsumer = ({
  children,
}: {
  children: (props: ReturnType<typeof useNextThemes>) => React.ReactNode;
}) => {
  const themeContext = useNextThemes();
  return <>{children(themeContext)}</>;
};
