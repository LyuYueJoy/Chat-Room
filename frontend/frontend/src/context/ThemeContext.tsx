"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Fab, Tooltip } from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [hydrated, setHydrated] = useState(false);

  // 加载localStorage
  useEffect(() => {
    const stored = localStorage.getItem("themeMode");
    if (stored === "dark" || stored === "light") {
      setMode(stored);
    }
    setHydrated(true);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {hydrated ? (
          <>
            {children}
            <Tooltip title="Light / Dark Mode" placement="top">
              <Fab
                color="primary"
                onClick={toggleTheme}
                size="small"
                sx={{
                  position: "fixed",
                  top: 16,
                  left: 16,
                  zIndex: 9999,
                }}
              >
                {mode === "light" ? "🌙" : "☀️"}
              </Fab>
            </Tooltip>
          </>
        ) : null}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
