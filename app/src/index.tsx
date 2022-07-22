import React from "react"
import ReactDOM from "react-dom/client"
import { CssBaseline, ThemeProvider } from "@mui/material"

import theme from "src/config/theme"
import { App } from "src/App"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLDivElement
)

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
