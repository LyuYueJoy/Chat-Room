"use client";

import React, { useEffect, useState } from "react";
import { getUserProfile, updateDisplayName } from "@/services/userService";
import { TextField, Button, Typography, Alert, Collapse } from "@mui/material";

export default function UserProfile() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(""); // Message text
  const [messageType, setMessageType] = useState<"success" | "error">("success"); // Alert type
  const [showMessage, setShowMessage] = useState(false); // Show/hide alert

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setEmail(data.email);
        setDisplayName(data.displayName || "");
        setNewDisplayName(data.displayName || "");
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
        showAlert("Failed to load user information", "error");
      });
  }, []);

  const showAlert = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000); // Auto-hide after 3s
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await updateDisplayName(newDisplayName);
      setDisplayName(newDisplayName);
      setEditing(false);
      showAlert("Display name updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update display name:", err);
      showAlert("Failed to update display name", "error");
    }
  };

  return (
    <div >
      <Typography variant="h6" gutterBottom>User Profile</Typography>
      <div style={{ padding: "1rem" }}>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        User Name: {displayName}
      </Typography>

        <Typography variant="subtitle1" fontWeight="bold">
        Email: {email}
      </Typography>

      {editing ? (
        <>
          <TextField
            label="New Display Name"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            style={{ marginTop: 16, marginBottom: 16 }}
          />
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </>
      ) : (
        <Button variant="outlined" style={{ marginTop: 16 }} onClick={handleEditClick}>
          Edit User Name
        </Button>
      )}

      {/* Inline Alert Message */}
      <Collapse in={showMessage}>
        <Alert
          severity={messageType}
          sx={{ marginTop: 2 }}
          onClose={() => setShowMessage(false)}
        >
          {message}
        </Alert>
      </Collapse>
      </div>
    </div>
  );
}
