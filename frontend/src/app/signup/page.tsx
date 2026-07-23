"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, User, Phone } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupFormValues } from "@/lib/validations";
import { ROUTES } from "@/constants/site";
import { cn } from "@/utils/cn";
import { useAuth } from "@/features/auth/auth-context";
import { ApiError } from "@/services/api";

function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export default function SignupPage() {
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup({
        full_name: data.name.trim(),
        email: data.email.trim(),
        phone: normalizePhone(data.phone),
        password: data.password,
        role: "customer",
      });
      toast.success("Account created successfully");
      // Full navigation so you land on the site right after signup.
      window.location.assign(ROUTES.home);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Unable to create account";
      toast.error(message);
    }
  };

  return (
    <AuthShell
      title="Join Solenne"
      subtitle="Create your account and enjoy curated coffee moments delivered or ready for pickup."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Alex Rivera"
          leftIcon={<User className="size-4" />}
          error={errors.name?.message}
          required
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          leftIcon={<Mail className="size-4" />}
          error={errors.email?.message}
          required
          {...register("email")}
        />

        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="+15551234567"
          leftIcon={<Phone className="size-4" />}
          error={errors.phone?.message}
          required
          {...register("phone")}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="SecurePass1!"
          leftIcon={<Lock className="size-4" />}
          error={errors.password?.message}
          required
          {...register("password")}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          leftIcon={<Lock className="size-4" />}
          error={errors.confirmPassword?.message}
          required
          {...register("confirmPassword")}
        />

        <div className="pt-1">
          <label className="flex cursor-pointer items-start gap-3 font-sans text-sm text-charcoal dark:text-cream">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 rounded border-latte/60 text-olive focus:ring-olive dark:border-latte/30"
              {...register("terms")}
            />
            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-olive underline-offset-2 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-olive underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p
              className="mt-1.5 font-sans text-xs text-red-600 dark:text-red-400"
              role="alert"
            >
              {errors.terms.message}
            </p>
          )}
        </div>

        <p className="font-sans text-xs text-charcoal/55 dark:text-cream/55">
          Password must include uppercase, lowercase, a number, and a special
          character.
        </p>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          loading={isSubmitting}
          className="mt-2 w-full rounded-2xl"
        >
          Create account
        </Button>
      </form>

      <p
        className={cn(
          "mt-8 text-center font-sans text-sm text-charcoal/70 dark:text-cream/70",
        )}
      >
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-olive transition-colors hover:text-olive/80"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
