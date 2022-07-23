import { Button, Paper, Typography } from "@mui/material"
import { AppState } from "src/App"

export const SettlemintDetails = ({
  updateState,
  appState,
}: {
  updateState: (newState: AppState) => void
  appState: AppState
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        padding: 6,
        display: "flex",
        flexDirection: "column",
        height: 1,
        gap: 4,
      }}
    >
      <Typography variant="h1">Settlemint Details</Typography>
      <Button
        onClick={() =>
          updateState({
            selectedSettlement: undefined,
            activeStep: 0,
          })
        }
        variant="contained"
      >
        Back
      </Button>
    </Paper>
  )
}

export default SettlemintDetails
