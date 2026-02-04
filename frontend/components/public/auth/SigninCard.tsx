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

const SigninCard = () => {
  return (
    <Card className="w-full max-w-sm bg-white/10 backdrop-blur rounded-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Sign in</CardTitle>
        <CardDescription>Enter your credentials to sign in</CardDescription>

        <CardAction>
          <Link href={`/sign-up`}>
            <Button variant="link">Sign up</Button>
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-6">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {/* <Link
                href="/forgot-password"
                className="text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link> */}
            </div>
            <Input id="password" type="password" required />
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Sign In
        </Button>

        <Button
          variant="outline"
          className="w-full bg-white/10 hover:bg-white/30"
        >
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SigninCard;
