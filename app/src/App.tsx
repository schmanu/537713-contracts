import styled from "@emotion/styled"
import { Box, Typography } from "@mui/material"
import { WalletControl } from "./components/WalletControl"

const Wrapper = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  align-items: center;
  overflow: auto;
  display: flex;
  justify-content: center;
`

const Topbar = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 50px;
  display: flex;
  align-items: center;
`

export const App = () => {
  return (
    <Wrapper>
      <Topbar
        sx={(theme) => {
          return {
            background: theme.palette.primary.light,
            boxShadow: `${theme.palette.primary.dark} 0 2px 2px 0px`,
          }
        }}
      >
        <Typography ml={2} variant="h1">
          537713
        </Typography>

        <WalletControl />
      </Topbar>
    </Wrapper>
  )
}
