const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const signupApi = async (data: {
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  password: string;
}) => {
  const res = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Signup failed");
  }

  return res.json(); // user / token / message
};

export const signinApi = async (data: {
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  password: string;
}) => {
  const res = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Signin failed");
  }

  return res.json(); // user / token / message
};

export const logoutApi = async () => {
  const res = await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Logout failed");
  }

  return res.json(); // user / token / message
};
