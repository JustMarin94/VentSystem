import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function SettingsForm() {
  const [frequency, setFrequency] = useState("");
  const [humidity, setHumidity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const apiUrl = "http://192.168.178.54:2000/api/config";

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(apiUrl);

        // safe defaults
        const data = response.data || {};
        const readInterval =
          typeof data.read_interval_ms === "number"
            ? data.read_interval_ms
            : 10000;
        const humidityThreshold =
          typeof data.humidity_threshold === "number"
            ? data.humidity_threshold
            : 50;

        setFrequency(readInterval / 1000); // convert ms → s
        setHumidity(humidityThreshold);
      } catch (err) {
        console.error("Error fetching config:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(apiUrl, {
        read_interval_ms: Number(frequency) * 1000,
        humidity_threshold: Number(humidity),
      });
      alert("Settings updated!");
      setError(false); // reset error if successful
    } catch (err) {
      console.error("Error saving config:", err);
      alert("Failed to update settings");
      setError(true);
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

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">
          Error loading or saving settings. Check server connection.
        </Typography>
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
