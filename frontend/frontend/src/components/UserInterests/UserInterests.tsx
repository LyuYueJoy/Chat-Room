"use client";

import React from "react";
import { Box, Chip, Typography, Stack } from "@mui/material";

interface UserInterestsProps {
  interests: string[];
}

export default function UserInterests({ interests }: UserInterestsProps) {
  if (!interests || interests.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {/* 暂无兴趣 */}
        No interest yet
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {/* 我的兴趣 */}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {interests.map((interest, index) => (
          <Chip
            key={index}
            label={interest}
            color="primary"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
}
