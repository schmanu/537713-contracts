import styled from "@emotion/styled"
import { AppBar, Box, Slide, Toolbar, Typography } from "@mui/material"
import { lazy, Suspense, useState } from "react"
import { WalletControl } from "./components/WalletControl"
import { Memberships, SettlemintMap } from "./hooks/useSettlemints"
const ANIMATION_DURATION = 300

const Wrapper = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  align-items: center;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding-top: 72px;
  padding-bottom: 32px;

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

const Header = styled(AppBar)`
  align-items: center;
  color: rgba(0, 0, 0, 0.87);
  position: "static";
`

const Main = styled.div`
  min-width: 60vw;
  max-width: 100vw;
  overflow: auto;
  position: relative;
  margin: auto;
`

export type AppState = {
  selectedSettlement?: string
  activeStep: number
  memberships?: Memberships
  settlemintMap?: SettlemintMap
}

const steps = [
  lazy(() => import("src/components/screens/Settlemints/Settlemints")),
  lazy(
    () => import("src/components/screens/SettlemintDetails/SettlemintDetails")
  ),
]

const AnimatedStep = ({
  in: inProp,
  animationDirection,
  children,
}: {
  in: boolean
  animationDirection: "right" | "left" | "up" | "down"
  children: JSX.Element | null
}) => (
  <Slide
    direction={animationDirection}
    in={inProp}
    enter
    exit
    unmountOnExit
    timeout={ANIMATION_DURATION}
  >
    <div>{children}</div>
  </Slide>
)

export const App = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [appState, setAppState] = useState<AppState>({
    activeStep: 0,
  })

  const [animateIn, setAnimateIn] = useState(true)
  const [animationDirection, setAnimationDirection] = useState<
    "right" | "left" | "up" | "down"
  >("right")

  // useEffect with appState.activeStep as dependency
  const transitionToStep = (newStep: number) => {
    const nextDirection = activeStep < newStep ? "left" : "right"

    // trigger animation out
    setAnimateIn(false)
    setTimeout(() => {
      setAnimationDirection(nextDirection)
      setActiveStep(newStep)
      setAnimateIn(true)
    }, ANIMATION_DURATION)
  }

  const updateState = (newAppState: AppState) => {
    if (appState.activeStep !== newAppState.activeStep) {
      transitionToStep(newAppState.activeStep)
    }
    console.log("new app state", newAppState)
    setAppState(newAppState)
  }

  const Step = steps[activeStep]

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
        <Toolbar
          sx={{
            width: "100%",
          }}
        >
          <Typography ml={2} fontFamily="monospace" variant="h1">
            0x537713
          </Typography>
          <Typography fontFamily="monospace" variant="h1" fontWeight={200}>
            Mint
          </Typography>
          <WalletControl />
        </Toolbar>
      </Header>
      <Main>
        <AnimatedStep
          key={activeStep}
          in={animateIn}
          animationDirection={animationDirection}
        >
          <Suspense fallback={<div>Loading... </div>}>
            <Step appState={appState} updateState={updateState} />
          </Suspense>
        </AnimatedStep>
      </Main>
    </Wrapper>
  )
}
