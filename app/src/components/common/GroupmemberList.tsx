import { Grid, Typography, ButtonBase, Chip, Button } from "@mui/material"
import { SettlemintDetails } from "src/hooks/useSettlemints"
import { shortenAddress } from "src/utils/addresses"
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone"
import AdminPanelSettingsTwoToneIcon from "@mui/icons-material/AdminPanelSettingsTwoTone"
import useWallet from "src/hooks/useWallet"
import { AddMemberDialog } from "./AddMemberDialog"
import { AddOwnerDialog } from "./AddOwnerDialog"

const rotatedColorPool = ["#3EC1D3", "#faff5b", "#FF9A00", "#FF165D"]

export const GroupMemberList = ({
  settlemintDetails,
}: {
  settlemintDetails: SettlemintDetails
}) => {
  const wallet = useWallet()
  const isOwner = wallet && settlemintDetails?.owners.includes(wallet.address)

  return (
    <Grid container direction="column" gap={4}>
      <Grid container direction="row">
        <Grid item>
          <Typography fontWeight={700}>Members</Typography>
          {isOwner && (
            <AddMemberDialog contractAddress={settlemintDetails.address} />
          )}
        </Grid>
        <Grid item xs>
          <Grid container direction="column" alignItems="flex-end">
            {settlemintDetails.members.length === 0 && (
              <Grid item xs={12}>
                <Typography>This group has no members.</Typography>
              </Grid>
            )}
            {settlemintDetails.members.map((address, idx) => (
              <Grid item xs={12} key={address}>
                <ButtonBase>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    borderRadius="6px"
                    borderRight={`4px solid ${
                      rotatedColorPool[idx % rotatedColorPool.length]
                    }`}
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
                          cursor: "default",
                          transition: "background-color 0.3s",
                          borderTopRightRadius: "0px",
                          borderBottomRightRadius: "0px",
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
                        {shortenAddress(address)}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip
                        icon={<AccountCircleTwoToneIcon />}
                        sx={{
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        label="Member"
                      />
                    </Grid>
                  </Grid>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item>
          <Typography fontWeight={700}>Owners</Typography>
          {isOwner && (
            <AddOwnerDialog contractAddress={settlemintDetails.address} />
          )}
        </Grid>
        <Grid item xs>
          <Grid container direction="column" alignItems="flex-end">
            {settlemintDetails.owners.map((address, idx) => (
              <Grid item xs={12} key={address}>
                <ButtonBase>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    borderRadius="6px"
                    borderRight={`4px solid ${
                      rotatedColorPool[idx % rotatedColorPool.length]
                    }`}
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
                          cursor: "default",
                          transition: "background-color 0.3s",
                          borderTopRightRadius: "0px",
                          borderBottomRightRadius: "0px",
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
                        {shortenAddress(address)}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip
                        icon={<AdminPanelSettingsTwoToneIcon />}
                        sx={{
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        label="Owner"
                      />
                    </Grid>
                  </Grid>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
