import { useMutation } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import agent from "../../api/agent";

export const useAccounts = () => {
    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            const response = await agent.post('/accounts/login?useCookie=true', creds);
            return response.data;
        }
    })

    return { loginUser };
}