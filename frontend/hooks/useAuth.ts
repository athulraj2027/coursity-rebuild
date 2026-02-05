import { useCallback } from "react";
import { loginSchema, registerSchema } from "@/validations/auth.schema";
import { toast } from "sonner";
import { signinApi, signupApi } from "@/services/auth.services";
import { setToken } from "@/lib/token";

export const useAuth = () => {
  const signupUser = useCallback(async (formData: FormData) => {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };
    const result = registerSchema.safeParse(rawData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError: string = Object.values(fieldErrors)[0]?.[0];
      if (firstError) {
        console.log(firstError);
        toast.error(firstError);
        return;
      }
    }

    const data = result.data;
    console.log("data : ", data);
    if (!data) return;

    try {
      const res = await signupApi({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      });

      console.log("token : ", res.token);
      setToken(res.token);
      toast.success("Account created successfully ");
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
      return false;
    }
  }, []);

  const signinUser = useCallback(async (formData: FormData) => {
    const rawData = {
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password"),
    };

    const result = loginSchema.safeParse(rawData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError: string = Object.values(fieldErrors)[0]?.[0];
      if (firstError) {
        console.log(firstError);
        toast.error(firstError);
        return;
      }
    }
    const data = result.data;
    console.log("data : ", data);
    if (!data) return;

    try {
      const res = await signinApi({
        email: data.email,
        role: data.role,
        password: data.password,
      });

      console.log("res : ", res);
      setToken(res.token);
      toast.success("Logged in successfully ");
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
      return null;
    }
  }, []);

  return { signupUser, signinUser };
};
