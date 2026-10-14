import { useAccounts } from "../../lib/hooks/useAccounts";
import { useForm } from "react-hook-form";
import type { LoginSchema } from "../../lib/schemas/loginSchema";
import { loginSchema } from "../../lib/schemas/loginSchema";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
    const { loginUser } = useAccounts();
    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: "onTouched",
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data);
    }

  return (
    <Paper 
        component={'form'} 
        onSubmit={handleSubmit(onSubmit)}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: 3,
            maxWidth: 'md',
            mx: 'auto',
            borderRadius: 3
        }}
    >
        <Box 
            display='flex' 
            alignItems={'center'} 
            justifyContent={'center'} 
            gap={3} 
            color={'secondary.main'}
        >
            <LockOpen fontSize="large"/>
            <Typography variant="h4">Sign in</Typography>
        </Box>
        <TextInput label="Email" control={control} name="email" />
        <TextInput label="Password" control={control} name="password" type="password" />
        <Button 
            type="submit" 
            variant="contained"
            color="primary"
            disabled={!isValid || isSubmitting}
            size="large"
        >
            Sign in 
        </Button>

    </Paper>
  )
}
