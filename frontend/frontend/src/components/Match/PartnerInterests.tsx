import React from "react";
import { Box, Typography } from "@mui/material";

interface PartnerInterestsProps {
  interests: string[];
}

export default function PartnerInterests({ interests }: PartnerInterestsProps) {
  if (!interests.length) return null;

  return (
    <Box mb={2}>
      <Typography variant="subtitle1" fontWeight="bold">Partner&#39;s Interests:</Typography>
      <Typography variant="body2">{interests.join(", ")}</Typography>
    </Box>
  );
}
