import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateUser = async () => {
    // Invalidate and refetch user data
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    // Force a router state refresh which will trigger beforeLoad
    await queryClient.refetchQueries({ queryKey: ["user"] });
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await updateUser();
    navigate({ to: "/dashboard" });
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    
    // Clear user from query cache
    queryClient.setQueryData(["user"], null);
    navigate({ to: "/signin" });
  };

  return {
    login,
    logout,
    updateUser,
  };
}
