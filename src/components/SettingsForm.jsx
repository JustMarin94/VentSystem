import React, { useState, useEffect } from "react";
import { Paper, TextField, Button, Box, CircularProgress } from "@mui/material";
import axios from "axios";

function SettingsForm() {
  const [frequency, setFrequency] = useState("");
  const [humidity, setHumidity] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const apiUrl = "http://192.168.178.54:2000/api/config";

  // Fetch current config on load
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        setFrequency(data.read_interval_ms / 1000); // Convert ms → seconds
        setHumidity(data.humidity_threshold);
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(apiUrl, {
        read_interval_ms: Number(frequency) * 1000, // seconds → ms
        humidity_threshold: Number(humidity),
      });
      alert("Settings updated!");
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to update settings");
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
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Frequency (s)"
          type="number"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          fullWidth
        />
        <TextField
          label="Humidity Threshold (%)"
          type="number"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" fullWidth disabled={saving}>
          {saving ? "Saving..." : "Set"}
        </Button>
      </Box>
    </Paper>
  );
}

export default SettingsForm;
