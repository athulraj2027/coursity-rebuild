import { jwtDecode } from "jwt-decode";
const TOKEN_KEY = "access_token";

type DecodedToken = {
  userId: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  exp: number;
};




export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};


