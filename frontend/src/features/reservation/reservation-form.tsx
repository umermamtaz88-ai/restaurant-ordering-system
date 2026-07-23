"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calendar, Clock, Mail, Phone, User, Users } from "lucide-react";
import {
  reservationSchema,
  type ReservationFormValues,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ReservationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
      notes: "",
    },
  });

  const onSubmit = async (_data: ReservationFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Reservation request received — we'll confirm by email shortly.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Full name"
        placeholder="Your name"
        leftIcon={<User className="size-4" />}
        error={errors.name?.message}
        required
        {...register("name")}
      />
      <div className="grid gap-5 sm:grid-cols-2">
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
          placeholder="+1 (555) 000-0000"
          leftIcon={<Phone className="size-4" />}
          error={errors.phone?.message}
          required
          {...register("phone")}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Date"
          type="date"
          leftIcon={<Calendar className="size-4" />}
          error={errors.date?.message}
          required
          {...register("date")}
        />
        <Input
          label="Time"
          type="time"
          leftIcon={<Clock className="size-4" />}
          error={errors.time?.message}
          required
          {...register("time")}
        />
      </div>
      <Input
        label="Guests"
        type="number"
        min={1}
        max={12}
        leftIcon={<Users className="size-4" />}
        error={errors.guests?.message}
        required
        {...register("guests", { valueAsNumber: true })}
      />
      <Textarea
        label="Special requests"
        placeholder="Allergies, occasion, seating preference…"
        rows={3}
        error={errors.notes?.message}
        {...register("notes")}
      />
      <Button
        type="submit"
        variant="secondary"
        size="lg"
        loading={isSubmitting}
        className="w-full rounded-2xl"
      >
        Request reservation
      </Button>
    </form>
  );
}
