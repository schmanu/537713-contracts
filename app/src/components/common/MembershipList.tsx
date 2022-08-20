import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone"
import AdminPanelSettingsTwoToneIcon from "@mui/icons-material/AdminPanelSettingsTwoTone"
import { ButtonBase, Chip, Grid, Typography } from "@mui/material"
import { useMemo } from "react"
import { rotatedColorPool } from "src/config/theme"
import { Memberships, SettlemintMap } from "src/hooks/useSettlemints"
import { shortenAddress } from "src/utils/addresses"

export const MembershipList = ({
  memberships,
  detailsMap,
  onItemClick,
}: {
  memberships?: Memberships
  detailsMap?: SettlemintMap
  onItemClick: (address: string) => void
}) => {
  const combinedList = useMemo(
    () =>
      new Map(
        memberships
          ? [
              ...Array.from(memberships?.membership.entries()),
              ...Array.from(memberships?.ownership.entries()),
            ]
          : []
      ),
    [memberships]
  )

  return (
    <Grid container direction="column" alignItems="flex-end">
      {combinedList.size === 0 && (
        <Grid item xs={12}>
          <Typography>You are no member of any SettleMint groups.</Typography>
        </Grid>
      )}
      {Array.from(combinedList.values()).map((settlemint, idx) => (
        <Grid item xs={12} key={settlemint.address}>
          <ButtonBase onClick={() => onItemClick(settlemint.address)}>
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
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                  "&": {
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                  },
                },
              ]}
            >
              <Grid item>
                <Typography>
                  {detailsMap?.get(settlemint.address)?.name}
                </Typography>
                <Typography
                  fontFamily="monospace"
                  textAlign="left"
                  width="140px"
                >
                  {shortenAddress(settlemint.address)}
                </Typography>
              </Grid>
              <Grid item>
                {memberships?.ownership.has(settlemint.address) ? (
                  <Chip
                    icon={<AdminPanelSettingsTwoToneIcon />}
                    sx={{
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    label="Owner"
                  />
                ) : (
                  <Chip
                    icon={<AccountCircleTwoToneIcon />}
                    sx={{
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    label="Member"
                  />
                )}
              </Grid>
            </Grid>
          </ButtonBase>
        </Grid>
      ))}
    </Grid>
  )
}
