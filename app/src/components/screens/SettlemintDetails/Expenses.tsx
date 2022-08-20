import { Box, Grid, Typography } from "@mui/material"
import { ethers } from "ethers"
import { AddExpenseDialog } from "src/components/common/AddExpenseDialog"
import { rotatedColorPool } from "src/config/theme"
import { SettlemintDetails } from "src/hooks/useSettlemints"

type Expense = {
  payer: string
  amount: string
  symbol: string
  participants: string[]
  description: string
  timestamp: number
}

export const Expenses = ({ settleMint }: { settleMint: SettlemintDetails }) => {
  const expenses: Expense[] = []

  return (
    <Box>
      <Grid container direction="column" mb={2}>
        {[...expenses, ...expenses].map((expense, idx) => (
          <Grid
            key={expense.timestamp.toString() + idx.toString()}
            item
            borderLeft={`4px solid ${
              rotatedColorPool[idx % rotatedColorPool.length]
            }`}
            sx={({ palette }) => ({
              borderBottom: `thin solid ${palette.divider}`,
            })}
            paddingLeft={2}
          >
            <Grid container direction="row" justifyContent="space-between">
              <Grid item>
                <Typography>{expense.description}</Typography>
                <Typography variant="subtitle2">
                  paid by{" "}
                  <span style={{ fontFamily: "monospace", fontWeight: 700 }}>
                    {expense.payer}
                  </span>
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {ethers.utils.formatEther(expense.amount)} {expense.symbol}
                </Typography>
                <Typography variant="subtitle2">
                  {new Date(expense.timestamp).toDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <AddExpenseDialog settleMint={settleMint} />
    </Box>
  )
}
