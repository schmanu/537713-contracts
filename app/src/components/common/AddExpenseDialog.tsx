import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import { ethers } from "ethers"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { SettlemintDetails } from "src/hooks/useSettlemints"
import useWallet from "src/hooks/useWallet"
import { SettleMint__factory } from "src/types/contracts"
import { ParticipantInput } from "./ParticipantInput"

type DialogData = {
  payer: string
  description: string
  amount: string
  participants: string[]
}

const validateAmount = (value: string) => {
  const asNumber = Number(value)
  if (isNaN(asNumber)) {
    return "Amount must be a number"
  }

  if (asNumber <= 0) {
    return "Amount must be > 0"
  }
}

export const AddExpenseDialog = ({
  settleMint,
}: {
  settleMint: SettlemintDetails
}) => {
  const [open, setOpen] = useState(false)
  const wallet = useWallet()

  const defaultValues = {
    payer: wallet?.address,
    participants: wallet ? [wallet.address] : [],
    amount: "",
    description: "",
  }

  const formMethods = useForm<DialogData>({
    mode: "all",
    defaultValues,
  })

  const { reset, register, formState, handleSubmit } = formMethods

  const onSubmit = async (data: DialogData) => {
    if (!wallet) {
      return
    }
    try {
      const { payer, participants, description, amount } = data
      const web3Provider = new ethers.providers.Web3Provider(wallet.provider)
      const contract = SettleMint__factory.connect(
        settleMint.address,
        web3Provider.getSigner()
      )
      const sortedParticipants = participants.sort()
      const amountInWei = ethers.utils.parseEther(amount)
      await contract.addExpense(
        amountInWei.toString(),
        payer,
        sortedParticipants,
        description
      )
      reset(defaultValues)
      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = () => {
    reset(defaultValues)
    setOpen(false)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="small"
        variant="contained"
        sx={{ marginRight: 4 }}
      >
        New Expense
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xl">
        <form action="submit" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>New Expense</DialogTitle>
          <DialogContent>
            <FormProvider {...formMethods}>
              <Box display="flex" flexDirection="column" gap={2} width="100%">
                <ParticipantInput
                  multiple={false}
                  margin="dense"
                  name={`payer`}
                  error={Boolean(formState.errors.payer)}
                  label={
                    formState.errors.payer
                      ? formState.errors.payer.message
                      : `Paid by`
                  }
                  fullWidth
                  variant="standard"
                  members={settleMint.members}
                />
                <TextField
                  margin="dense"
                  error={Boolean(formState.errors.amount)}
                  label={
                    formState.errors.amount
                      ? formState.errors.amount.message
                      : "Amount"
                  }
                  fullWidth
                  variant="standard"
                  {...register("amount", {
                    required: true,
                    validate: validateAmount,
                  })}
                />
                <TextField
                  error={Boolean(formState.errors.description)}
                  label={
                    formState.errors.description
                      ? formState.errors.description.type === "maxLength"
                        ? "Maximum 200 characters"
                        : formState.errors.description.message
                      : "Description"
                  }
                  {...register("description", {
                    maxLength: 200,
                  })}
                />
                <ParticipantInput
                  multiple
                  margin="dense"
                  name={`participants`}
                  error={Boolean(formState.errors.participants)}
                  label={
                    formState.errors.participants
                      ? formState.errors.participants.message
                      : `Participants`
                  }
                  fullWidth
                  variant="standard"
                  members={settleMint.members}
                />
              </Box>
            </FormProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
