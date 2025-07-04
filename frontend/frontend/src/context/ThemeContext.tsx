"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";

type Mode = "light" | "dark";

interface ThemeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  // 第一次客户端加载时读取localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setMode("dark");
    }
    setMounted(true); // 标记已挂载
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
};
