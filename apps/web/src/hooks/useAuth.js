import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useRegister() {
  return useMutation({
    mutationFn: async (data) => {
      const r = await api.post("/auth/register", data);
      localStorage.setItem("token", r.data.access_token);
      return r.data;
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data) => {
      const r = await api.post("/auth/login", data);
      localStorage.setItem("token", r.data.access_token);
      return r.data;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/auth/me")).data,
    enabled: !!localStorage.getItem("token"),
  });
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
