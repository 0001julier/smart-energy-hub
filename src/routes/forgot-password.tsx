import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — SmartLoad DR" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reset code sent (demo: 123456).");
    sessionStorage.setItem("pending_email", email);
    navigate({ to: "/reset-password" });
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We'll send a one-time code to reset your password."
      footer={<>Remembered it? <Link to="/login" className="text-primary hover:underline">Login</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Send reset code</Button>
      </form>
    </AuthShell>
  );
}
