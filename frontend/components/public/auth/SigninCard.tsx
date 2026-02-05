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
import SigninForm from "./SigninForm";

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
      <SigninForm />
    </Card>
  );
};

export default SigninCard;
