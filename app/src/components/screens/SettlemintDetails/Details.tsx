import { Grid, Typography } from "@mui/material"
import { GroupMemberList } from "src/components/common/GroupmemberList"
import { SettlemintDetails } from "src/hooks/useSettlemints"

export const Details = ({ settleMint }: { settleMint?: SettlemintDetails }) => {
  if (!settleMint) {
    return null
  }

  return (
    <>
      <Grid mt={4} mb={4} container direction="column">
        <Grid container direction="row">
          <Grid item>
            <Typography fontWeight={700}>Name</Typography>
          </Grid>
          <Grid item xs>
            <Typography textAlign="right">{settleMint?.name}</Typography>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item>
            <Typography fontWeight={700}>Address</Typography>
          </Grid>
          <Grid item xs>
            <Typography fontFamily="monospace" textAlign="right">
              {settleMint.address}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <GroupMemberList settlemintDetails={settleMint} />
    </>
  )
}
