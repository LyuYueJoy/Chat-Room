import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface MatchSnackbarProps {
  open: boolean;
  partnerId: string;
  onClose: () => void;
}

export default function MatchSnackbar({ open, partnerId, onClose }: MatchSnackbarProps) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity="success" sx={{ width: "100%" }}>
        🎉 Matched with user {partnerId}
      </Alert>
    </Snackbar>
  );
}
