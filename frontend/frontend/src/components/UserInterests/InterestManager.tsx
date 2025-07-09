"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Button,
  Typography,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  fetchUserInterests,
  addInterest,
  updateInterest,
  deleteInterest,
  InterestItem,
} from "@/services/userService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { presetInterests } from "@/models/presetInterests";



export default function InterestManager() {
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [newInterest, setNewInterest] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchUserInterests();
        setInterests(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Request failed");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const refreshInterests = async () => {
    const updated = await fetchUserInterests();
    setInterests(updated);
  };

  const handleAdd = async () => {
    setAddError(null);
    if (!newInterest.trim()) return;
    try {
      await addInterest(newInterest.trim());
      await refreshInterests();
      setNewInterest("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message.includes("maximum of 5")) {
          setAddError("You can have a maximum of 5 interests.");
        } else {
          setAddError(e.message);
        }
      } else {
        setAddError("Failed to add interest");
      }
    }
  };

  const handleUpdate = async (id: string, value: string) => {
    if (!value.trim()) return;
    try {
      await updateInterest(id, value.trim());
      await refreshInterests();
      setEditingId(null);
      setEditingValue("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to update interest");
      }
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInterest(deleteId);
      await refreshInterests();
      setDeleteConfirmOpen(false);
      if (editingId === deleteId) {
        setEditingId(null);
        setEditingValue("");
      }
      setDeleteId(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to delete interest");
      }
      setDeleteConfirmOpen(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeleteId(null);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Interests (max 5)
      </Typography>
      <List>
        {interests.map((item) => (
          <ListItem
            key={item.id}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {editingId === item.id ? (
              <>
                <Select
                  value={editingValue}
                  onChange={async (e) => {
                    const val = e.target.value;
                    setEditingValue(val);
                    await handleUpdate(item.id, val);
                  }}
                  size="small"
                  sx={{ flexGrow: 1, minWidth: 150 }}
                >
                  {presetInterests.map((interest) => (
                    <MenuItem key={interest} value={interest}>
                      {interest}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setEditingValue("");
                  }}
                  size="small"
                  color="secondary"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ flexGrow: 1 }}>{item.interest}</Typography>
                <IconButton
                  onClick={() => {
                    setEditingId(item.id);
                    setEditingValue(item.interest);
                  }}
                  color="primary"
                  title="Edit Interest"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(item.id)}
                  color="error"
                  title="Delete Interest"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>

      {interests.length < 5 && (
        <Box mt={2} display="flex" gap={1} alignItems="center">
          <Select
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            displayEmpty
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">
              <em>Please select an interest</em>
            </MenuItem>
            {presetInterests.map((interest) => (
              <MenuItem key={interest} value={interest}>
                {interest}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!newInterest}
          >
            Add
          </Button>
        </Box>
      )}

      {addError && (
        <Typography color="error" mt={1}>
          {addError}
        </Typography>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this interest? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
