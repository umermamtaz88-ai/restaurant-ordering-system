"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { useAuth } from "@/features/auth/auth-context";
import { ApiError } from "@/services/api";
import { isAdmin } from "@/lib/order-status";
import { ROUTES } from "@/constants/site";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitting(true);
    try {
      const user = await login({ email: data.email, password: data.password });
      if (!isAdmin(user.role)) {
        toast.error("This account is not an admin.");
        return;
      }
      toast.success("Welcome to admin");
      window.location.assign(ROUTES.admin);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1419] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151b22] p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-olive/20 text-olive">
            <Shield className="size-7" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">
            Admin login
          </h1>
          <p className="mt-2 font-sans text-sm text-white/55">
            Manage users, menu, orders, and café settings.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="admin@solenne.cafe"
            leftIcon={<Mail className="size-4" />}
            error={errors.email?.message}
            required
            className="border-white/15 bg-[#0f1419] text-white"
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="size-4" />}
            error={errors.password?.message}
            required
            className="border-white/15 bg-[#0f1419] text-white"
            {...register("password")}
          />
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={submitting}
            className="mt-2 w-full rounded-2xl"
          >
            Enter admin
          </Button>
        </form>

        <p className="mt-6 text-center font-sans text-xs text-white/35">
          Demo: admin@solenne.cafe / AdminPass1!
        </p>
      </div>
    </div>
  );
}
