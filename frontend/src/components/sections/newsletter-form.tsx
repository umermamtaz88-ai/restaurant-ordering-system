"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

interface NewsletterFormProps {
  compact?: boolean;
  className?: string;
}

export function NewsletterForm({ compact = false, className }: NewsletterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (_data: NewsletterFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("You're on the list — welcome to the Solenne circle.");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        compact ? "flex flex-col gap-2 sm:flex-row" : "flex flex-col gap-3 sm:flex-row sm:items-start",
        className,
      )}
      noValidate
    >
      <Input
        type="email"
        placeholder="you@email.com"
        aria-label="Email address"
        error={errors.email?.message}
        containerClassName="flex-1"
        {...register("email")}
      />
      <Button
        type="submit"
        loading={isSubmitting}
        className={cn("rounded-full", compact ? "sm:shrink-0" : "sm:mt-0")}
      >
        Subscribe
      </Button>
    </form>
  );
}
