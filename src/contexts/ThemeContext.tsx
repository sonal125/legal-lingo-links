
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

// Create a context for easier theme access
interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  systemTheme?: string;
  themes?: string[];
  isDark: boolean;
}

const defaultThemeContext: ThemeContextType = {
  theme: undefined,
  setTheme: () => {},
  systemTheme: undefined,
  themes: [],
  isDark: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// This function properly accesses the next-themes context
export function useNextThemes() {
  const { resolvedTheme, theme, setTheme, systemTheme } = useContext(
    (NextThemesProvider as any)._context ?? createContext({})
  );
  
  return {
    theme,
    setTheme,
    systemTheme,
    themes: ["light", "dark", "system"],
    isDark: theme === "dark" || (theme === "system" && systemTheme === "dark"),
  };
}

export const ThemeConsumer = ({
  children,
}: {
  children: (props: ThemeContextType) => React.ReactNode;
}) => {
  const themeContext = useNextThemes();
  return <>{children(themeContext)}</>;
};
