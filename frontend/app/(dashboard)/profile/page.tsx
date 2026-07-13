"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-6 p-6">
          <Avatar name="Admin User" size="lg" />
          <div>
            <h2 className="text-xl font-semibold">Admin User</h2>
            <p className="text-muted-foreground">admin@orderhub.com</p>
            <p className="text-sm text-muted-foreground mt-1">Restaurant Manager</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input defaultValue="Admin" placeholder="First Name" />
            <Input defaultValue="User" placeholder="Last Name" />
          </div>
          <Input defaultValue="admin@orderhub.com" placeholder="Email" type="email" />
          <Input defaultValue="+1 (555) 123-4567" placeholder="Phone" />
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input type="password" placeholder="Current Password" />
          <Input type="password" placeholder="New Password" />
          <Input type="password" placeholder="Confirm New Password" />
          <Button variant="outline">Update Password</Button>
          <p className="text-xs text-muted-foreground">
            Note: Authentication is not yet implemented in the backend API.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
