"use client";

import React, { useEffect, useState } from "react";
import {
  getMySchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "@/services/scheduleService";
import { Schedule } from "@/models/schedule";

import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    loadSchedules();
  }, []);

  async function loadSchedules() {
    try {
      setLoading(true);
      const res = await getMySchedules();
      setSchedules(res);
    } catch {
      setError("❌ Failed to load schedules.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSchedule() {
    if (!newDate || !newContent) {
      setError("⚠️ Please enter both date and content.");
      return;
    }

    try {
      await createSchedule({ date: newDate, content: newContent });
      setNewDate("");
      setNewContent("");
      await loadSchedules();
    } catch {
      setError("❌ Failed to add schedule.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSchedule(id);
      await loadSchedules();
    } catch {
      setError("❌ Failed to delete schedule.");
    }
  }

  async function handleEdit(id: string) {
    const schedule = schedules.find((s) => s.id === id);
    if (!schedule) return;
    setEditId(id);
    setEditContent(schedule.content);
    setEditDate(schedule.date);
  }

  async function handleSaveEdit(id: string) {
    try {
      await updateSchedule(id, {
        content: editContent,
        date: editDate,
      });
      setEditId(null);
      await loadSchedules();
    } catch {
      setError("❌ Failed to update schedule.");
    }
  }

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <Typography variant="h5" gutterBottom>
        🗓️ My Schedule
      </Typography>

      <Box mb={3} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Date"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddSchedule}>
          Add Schedule
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <List>
        {schedules.map((schedule) => (
          <ListItem
            key={schedule.id}
            divider
            secondaryAction={
              editId === schedule.id ? (
                <>
                  <IconButton onClick={() => handleSaveEdit(schedule.id)}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => setEditId(null)}>
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton onClick={() => handleEdit(schedule.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(schedule.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </>
              )
            }
          >
            {editId === schedule.id ? (
              <Box display="flex" flexDirection="column" width="100%" gap={1}>
                <TextField
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </Box>
            ) : (
              <ListItemText
                primary={schedule.content}
                secondary={new Date(schedule.date).toLocaleDateString()}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
