import {
  Autocomplete,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material"
import { useController, useFormContext } from "react-hook-form"

type ParticipantInputProps = TextFieldProps & {
  members: string[]
  name: string
  multiple: boolean
}

export const ParticipantInput = ({
  members,
  name,
  multiple,
  ...props
}: ParticipantInputProps) => {
  const { setValue, watch, control } = useFormContext()

  const { field } = useController({ name, control, defaultValue: members })

  const selectedAddresses = watch(name)

  return (
    <Autocomplete
      multiple={multiple}
      value={selectedAddresses}
      id="tags-standard"
      options={members}
      getOptionLabel={(option) => option}
      onBlur={field.onBlur}
      onChange={(event, value) => {
        field.onChange(event, value)
        setValue(name, value)
      }}
      renderOption={(props, option) => (
        <Typography component="li" fontFamily="monospace" {...props}>
          {option}
        </Typography>
      )}
      renderInput={(params) => (
        <TextField {...params} {...props} variant="standard" />
      )}
    />
  )
}
