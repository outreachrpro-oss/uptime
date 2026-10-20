"use client";

import { useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/hooks/use-auth";

export default function SettingsPage() {
  const { user, organization } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Settings"
        description="Account and notification preferences."
      />

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.name ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email ?? ""}
              readOnly
            />
          </div>
          {user?.emailVerified === false ? (
            <p className="text-sm text-warning">
              Email not verified. Check your inbox for the verification link.
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Profile updates will use account APIs when available.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name: </span>
            {organization?.name ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Slug: </span>
            {organization?.slug ?? "—"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">Email alerts</p>
            <p className="text-xs text-muted-foreground">
              Receive downtime notifications by email.
            </p>
          </div>
          <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <a href="/forgot-password">Change password</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
