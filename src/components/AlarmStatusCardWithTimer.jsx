import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function AlarmStatusCardWithTimer() {
  const [alarmState, setAlarmState] = useState("OFF");
  const [armed, setArmed] = useState(true);
  const [duration, setDuration] = useState(60); // default 60 min
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const TempDeactivateUrl =
    "http://192.168.178.54:2000/api/alarmDeactivateTimed";
  const armedUrl = "http://192.168.178.54:2000/api/alarmArmed";
  const alarmUrl = "http://192.168.178.54:2000/api/alarm";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get armed state
        const armedRes = await axios.get(armedUrl);
        setArmed(armedRes.data.armed);

        // Get buzzer state (alarm ON/OFF)
        const alarmRes = await axios.get(alarmUrl);
        // backend returns plain string "ON" or "OFF"
        setAlarmState(alarmRes.data || "OFF");
      } catch (err) {
        console.error("Could not fetch alarm status:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [armedUrl, alarmUrl]);

  // temporarily deactivate the system
  const tempDisarm = async () => {
    try {
      await axios.post(TempDeactivateUrl, {
        minutes: duration,
      });
    } catch (err) {
      console.error("Error disarming:", err);
      setError(true);
    }
  };

  const armSystem = async () => {
    try {
      await axios.post(armedUrl, { armed: true });
      setArmed(true);
      console.log("System manually ARMED");
    } catch (err) {
      console.error("Error arming system:", err);
      setError(true);
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
        <Typography color="error">Error loading data</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Alarm Status
      </Typography>

      <Typography variant="h6">
        Alarm Active: {alarmState === "ON" ? "🟢 ON" : "🔴 OFF"}
      </Typography>

      <Typography variant="h6" sx={{ mt: 1 }}>
        System Armed: {armed ? "🟢 YES" : "🟡 NO"}
      </Typography>

      <Button
        sx={{ mt: 1 }}
        variant="contained"
        color="success"
        onClick={armSystem}
        disabled={armed}
      >
        ARM System
      </Button>

      {/* Input: How long system stays disarmed */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 3, justifyContent: "center" }}
      >
        <TextField
          label="Disarm for (minutes)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          sx={{ width: 160 }}
          inputProps={{ min: 1 }}
        />

        <Button variant="contained" color="primary" onClick={tempDisarm}>
          Temporarily Disarm
        </Button>
      </Stack>
    </Paper>
  );
}

export default AlarmStatusCardWithTimer;
