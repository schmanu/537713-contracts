import {
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material"
import { ethers } from "ethers"
import { useSettlemints } from "src/hooks/useSettlemints"
import useWallet from "src/hooks/useWallet"
import { SettleMint__factory } from "src/types/contracts"
import { shortenAddress } from "src/utils/addresses"
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone"
import AdminPanelSettingsTwoToneIcon from "@mui/icons-material/AdminPanelSettingsTwoTone"

export const Settlemints = () => {
  const [settlemints, isLoading] = useSettlemints()

  const wallet = useWallet()

  const createNewSettlemint = async () => {
    if (!wallet) {
      return
    }
    const web3Provider = new ethers.providers.Web3Provider(wallet.provider)
    const createdContract = await new SettleMint__factory(
      web3Provider.getSigner()
    ).deploy(ethers.utils.hexZeroPad("0x0", 20), [wallet.address], "Testgroup")
  }

  const combinedList = new Map(
    settlemints
      ? [
          ...Array.from(settlemints?.membership.entries()),
          ...Array.from(settlemints?.ownership.entries()),
        ]
      : []
  )

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
      {isLoading || !settlemints ? (
        wallet ? (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="16px"
          >
            <CircularProgress />
            <Typography variant="h2">Loading Settlemints...</Typography>
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
                  Groups
                </Typography>
              </Grid>
              <Grid item sm={12} md={8}>
                <Grid container direction="column">
                  {combinedList.size === 0 && (
                    <Grid item xs={12}>
                      <Typography>
                        You are no member of any SettleMint groups.
                      </Typography>
                    </Grid>
                  )}
                  {Array.from(combinedList.values()).map((settlemint) => (
                    <Grid item xs={12} key={settlemint.address}>
                      <ButtonBase>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          borderRadius="6px"
                          gap="16px"
                          width="100%"
                          p={1}
                          sx={[
                            {
                              "&:hover": {
                                backgroundColor: (theme) =>
                                  theme.palette.primary.light,
                              },
                              "&": {
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                              },
                            },
                          ]}
                        >
                          <Grid item>
                            <Typography
                              fontFamily="monospace"
                              textAlign="left"
                              width="140px"
                            >
                              {shortenAddress(settlemint.address)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            {settlemints.ownership.has(settlemint.address) ? (
                              <Chip
                                icon={<AdminPanelSettingsTwoToneIcon />}
                                sx={{
                                  fontWeight: 700,
                                }}
                                label="Owner"
                              />
                            ) : (
                              <Chip
                                icon={<AccountCircleTwoToneIcon />}
                                label="Member"
                              />
                            )}
                          </Grid>
                        </Grid>
                      </ButtonBase>
                    </Grid>
                  ))}
                </Grid>
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
