"use client";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useThemeMode } from "@/context/ThemeContext";

export default function Navbar() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <AppBar position="static" color="default">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          ConnectSpace
        </Typography>
        <div>
          <Button color="inherit" href="/login">
            login
          </Button>
          <Button color="inherit" href="/register">
            register
          </Button>
          <Button color="inherit" onClick={toggleMode}>
            {mode === "dark" ? "light" : "dark"}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
