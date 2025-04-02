
import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

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
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </NextThemesProvider>
  );
}

// Create a context for easier theme access
interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  systemTheme?: string;
  themes: string[];
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

// Create a provider that uses next-themes under the hood
const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the next-themes hook directly
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  // Define all available themes
  const themes = ["light", "dark", "blue", "purple", "green", "orange", "system"];
  
  // Determine if the current theme is dark
  const isDark = 
    theme === "dark" || 
    (theme === "system" && systemTheme === "dark") ||
    theme === "blue";
  
  const value = {
    theme,
    setTheme,
    systemTheme,
    themes,
    isDark
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export a hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Export this for backward compatibility
export function useNextThemes() {
  return useTheme();
}

export const ThemeConsumer = ({
  children,
}: {
  children: (props: ThemeContextType) => React.ReactNode;
}) => {
  const themeContext = useTheme();
  return <>{children(themeContext)}</>;
};
