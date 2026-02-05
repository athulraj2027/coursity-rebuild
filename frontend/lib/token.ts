import { jwtDecode } from "jwt-decode";
const TOKEN_KEY = "access_token";

type DecodedToken = {
  userId: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  exp: number;
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};
