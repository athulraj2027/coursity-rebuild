"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";

import SignupForm from "./SignupForm";

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
      <SignupForm />
    </Card>
  );
};

export default SignupCard;
