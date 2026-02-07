"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { areFieldsFilled } from "@/lib/handleFormChange";
import { SIGNIN_FORM_REQUIRED_FIELDS } from "@/utils/constants/authForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const SigninForm = () => {
  const router = useRouter();
  const { signinUser } = useAuth();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await signinUser(new FormData(e.currentTarget));
      //   console.log(data);

      if (data?.success) {
        console.log("redirecting ...");
        router.replace(`/${data.res?.role.toLocaleLowerCase()}`);
        return;
      }
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const valid = areFieldsFilled(e.currentTarget, SIGNIN_FORM_REQUIRED_FIELDS);
    setIsValid(valid);
  };
  return (
    <form
      className="flex flex-col gap-6"
      onChange={handleFormChange}
      onSubmit={onSubmit}
    >
      <CardContent>
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            name="email"
            required
          />
        </div>

        <div className="grid gap-2 mt-2">
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
        <div className="grid gap-2 mt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {/* <Link
                href="/forgot-password"
                className="text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link> */}
          </div>
          <Input id="password" type="password" name="password" required />
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Signing you in ..." : "Sign in"}
        </Button>

        <Button
          variant="outline"
          className="w-full bg-white/10 hover:bg-white/30"
          type="button"
        >
          Sign in with Google
        </Button>
      </CardFooter>
    </form>
  );
};

export default SigninForm;
