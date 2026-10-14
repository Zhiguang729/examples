import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import { useController } from "react-hook-form"
import type { UseControllerProps, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {} & UseControllerProps<T> & TextFieldProps;  // textfield props includes things like label, default value, etc. from MUI. UseControllerProps includes name, control, etc.

export default function TextInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState} = useController(props);
  return (
    <TextField 
    {...props} 
    {...field}
    fullWidth
    variant="outlined"
    error={!!fieldState.error}
    helperText={fieldState.error?.message} 
    />
  )
}
