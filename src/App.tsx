import React from "react";
import "./App.css";
import { Box } from "@mui/material";
import Navigation from "./router";

function App() {
  return (
    <div className="App">
      <Box
        sx={{
          minHeight: "calc(100vh - 72px)",
          bgcolor: "var(--mui-palette-background-level1)",
          padding: 3,
        }}
      >
        <Navigation />
      </Box>
    </div>
  );
}

export default App;
