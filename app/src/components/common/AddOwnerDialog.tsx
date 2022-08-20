import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { ethers } from "ethers"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useWallet from "src/hooks/useWallet"
import { SettleMint__factory } from "src/types/contracts"
import AddressInput from "./AddressInput"

type DialogData = {
  address: string
}

export const AddOwnerDialog = ({
  contractAddress,
}: {
  contractAddress: string
}) => {
  const [open, setOpen] = useState(false)

  const formMethods = useForm<DialogData>({
    mode: "all",
    defaultValues: {
      address: "",
    },
  })

  const { setValue, watch, handleSubmit } = formMethods

  const wallet = useWallet()

  const onSubmit = async () => {
    if (!wallet) {
      return
    }

    const address = watch("address")

    const web3Provider = new ethers.providers.Web3Provider(wallet.provider)
    const contract = SettleMint__factory.connect(
      contractAddress,
      web3Provider.getSigner()
    )

    await contract.addOwner(address)
    setValue("address", "")
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
        Add
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form action="submit" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add Owner</DialogTitle>
          <DialogContent>
            <FormProvider {...formMethods}>
              <DialogContentText>
                Enter the address of the owner you want to add. Be aware that
                owners can remove and add other owners and members.
              </DialogContentText>
              <AddressInput
                margin="dense"
                name="address"
                label="Owner address"
                fullWidth
                variant="standard"
              />
            </FormProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Owner</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
