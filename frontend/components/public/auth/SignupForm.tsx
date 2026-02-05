"use client";
import React, { useState } from "react";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/token";
import { areFieldsFilled } from "@/lib/handleFormChange";
import { SIGNUP_FORM_REQUIRED_FIELDS } from "@/utils/constants/authForm";

const SignupForm = () => {
  const router = useRouter();
  const { signupUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await signupUser(new FormData(e.currentTarget));
      console.log(data);

      if (data) {
        const user = getUserFromToken();
        router.push(`/${user?.role.toLocaleLowerCase()}`);
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
      className="flex flex-col gap-6"
      onSubmit={onSubmit}
      onChange={handleFormChange}
    >
      <CardContent>
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">You are (select your designation):</Label>

          <RadioGroup
            className="flex items-center gap-2"
            defaultValue=""
            name="role"
          >
            <FieldLabel htmlFor="student">
              <Field
                orientation="horizontal"
                className="flex items-center gap-2"
              >
                <FieldContent>
                  <FieldTitle>Student</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="STUDENT" id="student" />
              </Field>
            </FieldLabel>

            <FieldLabel htmlFor="teacher">
              <Field
                orientation="horizontal"
                className="flex items-center gap-2"
              >
                <FieldContent>
                  <FieldTitle>Teacher</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="TEACHER" id="teacher" />
              </Field>
            </FieldLabel>

            <FieldLabel htmlFor="admin">
              <Field
                orientation="horizontal"
                className="flex items-center gap-2"
              >
                <FieldContent>
                  <FieldTitle>Admin</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="ADMIN" id="admin" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" required />
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
          />
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>

        <Button
          variant="outline"
          className="w-full bg-white/10 hover:bg-white/30"
          type="button"
        >
          Sign up with Google
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
