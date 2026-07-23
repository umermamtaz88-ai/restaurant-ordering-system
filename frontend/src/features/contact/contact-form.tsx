"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, User, MessageSquare } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (_data: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Message sent — we'll get back to you within 24 hours.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Name"
        placeholder="Your name"
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
        label="Subject"
        placeholder="How can we help?"
        leftIcon={<MessageSquare className="size-4" />}
        error={errors.subject?.message}
        required
        {...register("subject")}
      />
      <Textarea
        label="Message"
        placeholder="Tell us more…"
        rows={5}
        error={errors.message?.message}
        required
        {...register("message")}
      />
      <Button
        type="submit"
        variant="secondary"
        size="lg"
        loading={isSubmitting}
        className="w-full rounded-2xl"
      >
        Send message
      </Button>
    </form>
  );
}
