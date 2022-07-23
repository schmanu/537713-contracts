import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material"
import { ethers } from "ethers"
import { useSettlemints } from "src/hooks/useSettlemints"
import useWallet from "src/hooks/useWallet"
import { SettleMint__factory } from "src/types/contracts"

import { AppState } from "src/App"
import { MembershipList } from "src/components/common/MembershipList"
import { useEffect } from "react"

export const Settlemints = ({
  updateState,
  appState,
}: {
  updateState: (newState: AppState) => void
  appState: AppState
}) => {
  const [memberships, detailsMap, isLoading] = useSettlemints()

  useEffect(() => {
    if (!isLoading) {
      updateState({
        ...appState,
        memberships: memberships,
        settlemintMap: detailsMap,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const wallet = useWallet()

  const createNewSettlemint = async () => {
    if (!wallet) {
      return
    }
    const web3Provider = new ethers.providers.Web3Provider(wallet.provider)
    await new SettleMint__factory(web3Provider.getSigner()).deploy(
      ethers.utils.hexZeroPad("0x0", 20),
      [wallet.address],
      "Testgroup"
    )
  }

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
      {isLoading || !memberships ? (
        wallet ? (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="16px"
          >
            <CircularProgress />
            <Typography variant="h2">Loading SettleMints...</Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="16px"
          >
            <Typography variant="h2">
              You need to connect a wallet to use this app.
            </Typography>
          </Box>
        )
      ) : (
        <Box>
          <Grid container direction="column" mb={8}>
            <Grid container direction="row" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4" fontWeight={700}>
                  Your SettleMints
                </Typography>
              </Grid>
              <Grid item sm={12} md={8}>
                <MembershipList
                  detailsMap={detailsMap}
                  memberships={memberships}
                  onItemClick={(address) => {
                    updateState({
                      ...appState,
                      activeStep: 1,
                      selectedSettlement: address,
                    })
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Button variant="contained" onClick={createNewSettlemint}>
            Create new SettleMint
          </Button>
        </Box>
      )}
    </Paper>
  )
}

export default Settlemints
