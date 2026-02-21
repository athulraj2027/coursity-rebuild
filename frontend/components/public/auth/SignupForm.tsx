"use client";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { areFieldsFilled } from "@/lib/handleFormChange";
import { SIGNUP_FORM_REQUIRED_FIELDS } from "@/utils/constants/authForm";
import { Loader2, GraduationCap, BookOpen, ShieldCheck } from "lucide-react";

/* ─── Dark input ──────────────────────────────────────────────────────────── */
const DarkInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full h-10 px-3.5 rounded-xl bg-white/8 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-150"
  />
);

/* ─── Dark label ──────────────────────────────────────────────────────────── */
const DarkLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
    {children}
  </label>
);

/* ─── Role option ─────────────────────────────────────────────────────────── */
const RoleOption = ({
  id,
  value,
  label,
  icon: Icon,
  checked,
}: {
  id: string;
  value: string;
  label: string;
  icon: React.ElementType;
  checked: boolean;
}) => (
  <label
    htmlFor={id}
    className={`flex flex-1 items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${
      checked
        ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-300"
        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
    }`}
  >
    <RadioGroupItem value={value} id={id} className="sr-only" />
    <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
    <span className="text-xs font-semibold">{label}</span>
  </label>
);

/* ─── Main Form ───────────────────────────────────────────────────────────── */
const SignupForm = () => {
  const router = useRouter();
  const { signupUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await signupUser(new FormData(e.currentTarget));
      if (data?.success) {
        router.replace(`/${data.res.role.toLocaleLowerCase()}`);
        return;
      }
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const valid = areFieldsFilled(e.currentTarget, SIGNUP_FORM_REQUIRED_FIELDS);
    setIsValid(valid);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
      onChange={handleFormChange}
    >
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>Name</DarkLabel>
        <DarkInput
          id="name"
          type="text"
          name="name"
          placeholder="John Doe"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>Email</DarkLabel>
        <DarkInput
          id="email"
          type="email"
          name="email"
          placeholder="m@example.com"
          required
        />
      </div>

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>I am a</DarkLabel>
        <RadioGroup
          className="flex gap-2 border-0"
          defaultValue=""
          name="role"
          onValueChange={setSelectedRole}
        >
          <RoleOption
            id="student"
            value="STUDENT"
            label="Student"
            icon={GraduationCap}
            checked={selectedRole === "STUDENT"}
          />
          <RoleOption
            id="teacher"
            value="TEACHER"
            label="Teacher"
            icon={BookOpen}
            checked={selectedRole === "TEACHER"}
          />
         
        </RadioGroup>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>Password</DarkLabel>
        <DarkInput id="password" type="password" name="password" required />
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>Confirm Password</DarkLabel>
        <DarkInput
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          required
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/8 my-1" />

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold tracking-wide transition-all duration-150 shadow-md shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Google */}
      <button
        type="button"
        className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-white/8 hover:bg-white/12 text-white text-sm font-semibold border border-white/10 hover:border-white/20 transition-all duration-150"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </button>
    </form>
  );
};

export default SignupForm;
