"use client";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Navbar() {

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
        </div>
      </Toolbar>
    </AppBar>
  );
}
