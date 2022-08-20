import { Box, Button, Paper, Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react"
import { AppState } from "src/App"
import { Details } from "./Details"
import { Expenses } from "./Expenses"

export const SettlemintDetails = ({
  updateState,
  appState,
}: {
  updateState: (newState: AppState) => void
  appState: AppState
}) => {
  const [selectedTab, setSelectedTab] = useState("details")

  const handleChangeTab = (
    _: React.SyntheticEvent<Element, Event>,
    newTab: string
  ) => {
    setSelectedTab(newTab)
  }

  if (!appState.selectedSettlement) {
    return null
  }

  const selectedSettlemint = appState.settlemintMap?.get(
    appState.selectedSettlement
  )

  if (!selectedSettlemint) {
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
      <Typography variant="h3">{selectedSettlemint.name}</Typography>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Tabs value={selectedTab} onChange={handleChangeTab}>
          <Tab label="Details" value="details" id="details-tab" />
          <Tab label="Expenses" value="expenses" id="expenses-tab" />
        </Tabs>
        <Button
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
      </Box>
      <div
        role="tabpanel"
        hidden={selectedTab !== "details"}
        id="details-tab"
        aria-labelledby="details-tab"
      >
        <Details settleMint={selectedSettlemint} />
      </div>
      <div
        role="tabpanel"
        hidden={selectedTab !== "expenses"}
        id="expenses-tab"
        aria-labelledby="expenses-tab"
      >
        <Expenses settleMint={selectedSettlemint} />
      </div>
    </Paper>
  )
}

export default SettlemintDetails
