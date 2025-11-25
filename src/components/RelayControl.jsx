import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";

function RelayControl() {
  const [relayState, setRelayState] = useState("OFF");
  const [relayMode, setRelayMode] = useState("AUTO");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const relayUrl = "http://192.168.178.54:2000/api/relay";
  const modeUrl = "http://192.168.178.54:2000/api/relay/mode";

  // Fetch current relay state & mode on load
  useEffect(() => {
    const fetchRelay = async () => {
      try {
        // Get relay state
        const stateResp = await axios.get(relayUrl, { responseType: "text" });
        setRelayState(stateResp.data.trim());

        // Get relay mode
        const modeResp = await axios.get(modeUrl, { responseType: "text" });
        setRelayMode(modeResp.data.trim());
      } catch (error) {
        console.error("Error fetching relay info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelay();
    const interval = setInterval(fetchRelay, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update relay state (manual only)
  const setRelay = async (state) => {
    if (relayMode !== "MANUAL") return;
    setSaving(true);
    try {
      await axios.post(relayUrl, { state }); // only send state
      setRelayState(state);
    } catch (error) {
      console.error("Error updating relay state:", error);
      alert("Failed to update relay state");
    } finally {
      setSaving(false);
    }
  };

  // Toggle between AUTO and MANUAL
  const toggleMode = async () => {
    setSaving(true);
    try {
      const newMode = relayMode === "AUTO" ? "MANUAL" : "AUTO";
      await axios.post(modeUrl, { mode: newMode }); // only send mode
      setRelayMode(newMode);
    } catch (error) {
      console.error("Error updating relay mode:", error);
      alert("Failed to update relay mode");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="subtitle1" gutterBottom>
        Mode: {relayMode}
      </Typography>

      <Typography
        variant="h6"
        sx={{ mb: 2, color: relayState === "ON" ? "green" : "red" }}
      >
        Current State: {relayState}
      </Typography>

      {/* Manual mode toggle */}
      <Button
        variant="outlined"
        color={relayMode === "MANUAL" ? "success" : "primary"}
        onClick={toggleMode}
        fullWidth
        sx={{ mb: 2 }}
        disabled={saving}
      >
        {relayMode === "MANUAL"
          ? "Deactivate Manual Mode"
          : "Activate Manual Mode"}
      </Button>

      {/* ON/OFF buttons (enabled only in MANUAL) */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setRelay("ON")}
          disabled={relayMode !== "MANUAL" || saving}
          fullWidth
        >
          ON
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setRelay("OFF")}
          disabled={relayMode !== "MANUAL" || saving}
          fullWidth
        >
          OFF
        </Button>
      </Box>
    </Paper>
  );
}

export default RelayControl;
