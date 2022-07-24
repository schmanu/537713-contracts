import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material"
import { ethers } from "ethers"
import { useState } from "react"
import useWallet from "src/hooks/useWallet"
import { SettleMint__factory } from "src/types/contracts"

export const AddMemberDialog = ({
  contractAddress,
}: {
  contractAddress: string
}) => {
  const [open, setOpen] = useState(false)

  const [address, setAddress] = useState("")

  const wallet = useWallet()

  const handleSubmit = async () => {
    if (!wallet || !address || !ethers.utils.isAddress(address)) {
      return
    }

    const web3Provider = new ethers.providers.Web3Provider(wallet.provider)
    const contract = SettleMint__factory.connect(
      contractAddress,
      web3Provider.getSigner()
    )

    await contract.addMember(address)
    setAddress("")
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
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the address of the member you want to add.
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Member address"
            type="email"
            fullWidth
            variant="standard"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Member</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
