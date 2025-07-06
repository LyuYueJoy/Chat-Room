"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
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

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
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
        {children}
        {/* 全局按钮 */}
        <Tooltip title="切换亮/暗模式" placement="top">
          <Fab
            color="primary"
            onClick={toggleTheme}
            size="small"
            sx={{
              position: "fixed",
              bottom: 16,
              left: 16,
              zIndex: 9999,
            }}
          >
            {mode === "light" ? "dark" : "light"}
          </Fab>
        </Tooltip>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
