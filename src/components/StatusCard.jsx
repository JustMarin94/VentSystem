import React, { useState, useEffect } from "react";
import { Paper, Typography, Grid, CircularProgress } from "@mui/material";
import axios from "axios";

function StatusCard() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = "http://192.168.178.54:2000/api/data";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.length > 0) {
          // Latest measurement is first element
          const latest = data[0];
          setTemperature(latest.temperature_in);
          setHumidity(latest.humidity_in);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6}>
          <Typography variant="h6">Temperature</Typography>
          <Typography variant="h5">{temperature}°C</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Humidity</Typography>
          <Typography variant="h5">{humidity}%</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default StatusCard;
