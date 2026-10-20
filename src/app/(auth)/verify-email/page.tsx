"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <Card className="border-border/80 shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="size-6 text-primary" aria-hidden />
        </div>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          {token
            ? "Email verification is processed when you open the link from your inbox. If you just registered, check your email for the verification link."
            : "We sent a verification link to your email address. Open that link to activate your account."}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive it? Check spam or sign in to request a new link from
        account settings once available.
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button asChild className="w-full">
          <Link href="/login">Go to sign in</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/">Back to home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card className="border-border/80 p-8 text-center text-sm text-muted-foreground">
          Loading…
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
