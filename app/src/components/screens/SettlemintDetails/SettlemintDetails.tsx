import { Button, Grid, Paper, Typography } from "@mui/material"
import { AppState } from "src/App"
import { GroupMemberList } from "src/components/common/GroupmemberList"

export const SettlemintDetails = ({
  updateState,
  appState,
}: {
  updateState: (newState: AppState) => void
  appState: AppState
}) => {
  if (!appState.selectedSettlement) {
    console.log("No settlemint selected. Cannot render details")
    return null
  }

  const selectedSettlemint = appState.settlemintMap?.get(
    appState.selectedSettlement
  )

  if (!selectedSettlemint) {
    console.log(
      "No settlemint details found for address",
      appState.selectedSettlement,
      appState.settlemintMap
    )

    return null
  }

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 6,
        display: "flex",
        flexDirection: "column",
        height: 1,
        gap: 1,
      }}
    >
      <div>
        <Typography variant="h3">Settlemint Details</Typography>
        <Button
          sx={{
            marginTop: -4,
            float: "right",
          }}
          size="small"
          onClick={() =>
            updateState({
              selectedSettlement: undefined,
              activeStep: 0,
            })
          }
          variant="outlined"
        >
          &larr; Back
        </Button>
      </div>
      <Grid mt={4} mb={4} container direction="column">
        <Grid container direction="row">
          <Grid item>
            <Typography fontWeight={700}>Name</Typography>
          </Grid>
          <Grid item xs>
            <Typography textAlign="right">
              {selectedSettlemint?.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item>
            <Typography fontWeight={700}>Address</Typography>
          </Grid>
          <Grid item xs>
            <Typography fontFamily="monospace" textAlign="right">
              {appState.selectedSettlement}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <GroupMemberList settlemintDetails={selectedSettlemint} />
    </Paper>
  )
}

export default SettlemintDetails
