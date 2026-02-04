import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SignupCard = () => {
  return (
    <Card className="w-full max-w-sm bg-white/10 backdrop-blur rounded-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>

        <CardAction>
          <Link href={`/sign-in`}>
            <Button variant="link">Sign in</Button>
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-6">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">You are (select your designation):</Label>

            <RadioGroup className="flex items-center gap-2" defaultValue="">
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
            <Input id="password" type="password" required />
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" required />
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Create Account
        </Button>

        <Button
          variant="outline"
          className="w-full bg-white/10 hover:bg-white/30"
        >
          Sign up with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignupCard;
