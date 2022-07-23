import styled from "@emotion/styled"
import { Box, Typography } from "@mui/material"
import { Settlemints } from "./components/screens/Settlemints/Settlemints"
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

  // Animation:
  background: linear-gradient(-45deg, #9ee6da, #8bf9cb, #be9ad5, #c8c1d7);
  background-size: 400% 400%;
  animation: gradient 30s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`

const Header = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 50px;
  display: flex;
  align-items: center;
`

const Main = styled.div`
  width: 80vw;
  position: relative;
  margin: auto;
`

export const App = () => {
  return (
    <Wrapper>
      <Header
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
        <Typography variant="h1" fontWeight={200}>
          Mint
        </Typography>
        <WalletControl />
      </Header>
      <Main>
        <Settlemints />
      </Main>
    </Wrapper>
  )
}
