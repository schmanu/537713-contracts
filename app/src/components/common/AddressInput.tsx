import { Grid, TextField, TextFieldProps } from "@mui/material"
import { isAddress } from "ethers/lib/utils"
import { ReactElement } from "react"
import { useFormContext, Validate } from "react-hook-form"

export type AddressInputProps = TextFieldProps & {
  name: string
  validate?: Validate<string>
}

const AddressInput = ({
  name,
  validate,
  ...props
}: AddressInputProps): ReactElement => {
  const {
    register,

    formState: { errors },
  } = useFormContext()
  const validateAddress = (address: string) => {
    const ADDRESS_RE = /^0x[0-9a-zA-Z]{40}$/

    if (!ADDRESS_RE.test(address)) {
      return "Invalid address format"
    }

    if (!isAddress(address)) {
      return "Invalid address checksum"
    }
  }

  return (
    <Grid container alignItems="center" gap={1}>
      <Grid item flexGrow={1}>
        <TextField
          {...props}
          autoComplete="off"
          label={<>{errors[name]?.message || props.label}</>}
          error={!!errors[name]}
          fullWidth
          {...register(name, {
            required: true,
            validate: (val: string) => validateAddress(val) || validate?.(val),
          })}
        />
      </Grid>
    </Grid>
  )
}

export default AddressInput
