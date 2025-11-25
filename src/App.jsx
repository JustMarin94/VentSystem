// App.jsx
import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import StatusCard from "./components/StatusCard";
import RelayControl from "./components/RelayControl";
import SettingsForm from "./components/SettingsForm";

function App() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Vent System
      </Typography>

      <Box sx={{ mb: 3 }}>
        <StatusCard />
      </Box>

      <Box sx={{ mb: 3 }}>
        <RelayControl />
      </Box>

      <Box>
        <SettingsForm />
      </Box>
    </Container>
  );
}

export default App;
