import { Box, Button, Divider, Grid, Typography } from "@mui/material"
import { useOnboard } from "src/hooks/useOnboard"
import useWallet from "src/hooks/useWallet"

const chainNameMapping = {
  ["1" as string]: "Ethereum",
  ["4" as string]: "Rinkeby",
  ["5" as string]: "Görli",
}

const shortenAddress = (address: string) =>
  address.slice(0, 7) + "..." + address.slice(37, 42)

export const WalletControl = () => {
  const onboard = useOnboard()

  const wallet = useWallet()

  const onConnect = () => {
    onboard?.connectWallet()
  }

  const onDisconnect = () => {
    if (wallet) {
      onboard?.disconnectWallet({ label: wallet?.label })
    }
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-end"
      mr={2}
      alignItems="center"
      gap={2}
    >
      <Grid item>
        <Box>
          <Typography fontWeight={700}>
            {wallet ? shortenAddress(wallet?.address) : "No wallet connected"}
          </Typography>
          {wallet && (
            <div style={{ display: "inline-flex", gap: "8px" }}>
              <Typography fontWeight={200}>{wallet.label}</Typography>
              {" | "}
              <Typography fontWeight={200}>
                {chainNameMapping[wallet.chainId]}
              </Typography>
            </div>
          )}
        </Box>
      </Grid>
      <Grid item>
        {wallet ? (
          <Button onClick={onDisconnect} variant="contained">
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={onConnect} variant="contained">
            Connect Wallet
          </Button>
        )}
      </Grid>
    </Grid>
  )
}
