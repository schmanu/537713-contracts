import styled from "@emotion/styled"
import { Box, Slide, Typography } from "@mui/material"
import { lazy, Suspense, useState } from "react"
import { WalletControl } from "./components/WalletControl"
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

export type AppState = {
  selectedSettlement?: string
  activeStep: number
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

  const transitionToStep = (newStep: number) => {
    const nextDirection = activeStep < newStep ? "left" : "right"

    // trigger animation out
    setAnimateIn(false)
    setTimeout(() => {
      setAnimationDirection(nextDirection)
      setActiveStep(newStep)
      setAnimateIn(true)
      console.log(nextDirection)
    }, ANIMATION_DURATION)
  }

  const updateState = (newAppState: AppState) => {
    if (appState.activeStep !== newAppState.activeStep) {
      transitionToStep(newAppState.activeStep)
    }
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
        <Typography ml={2} variant="h1">
          537713
        </Typography>
        <Typography variant="h1" fontWeight={200}>
          Mint
        </Typography>
        <WalletControl />
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
