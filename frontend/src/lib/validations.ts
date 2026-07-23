import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    "Use upper, lower, number, and special character",
  );

const phoneSchema = z
  .string()
  .min(8, "Please enter a valid phone number")
  .refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15;
  }, "Please enter a valid phone number");

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: phoneSchema,
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s+\-()]+$/, "Please enter a valid phone number"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  guests: z
    .number({ error: "Please enter number of guests" })
    .int()
    .min(1, "At least 1 guest")
    .max(12, "Maximum 12 guests"),
  notes: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const checkoutSchema = z
  .object({
    deliveryType: z.enum(["pickup", "delivery"]),
    address: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    paymentMethod: z.enum(["card", "cash", "wallet"]),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "delivery") {
      if (!data.address?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Address is required for delivery",
          path: ["address"],
        });
      }
      if (!data.city?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "City is required for delivery",
          path: ["city"],
        });
      }
      if (!data.zipCode?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Zip code is required for delivery",
          path: ["zipCode"],
        });
      }
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type ReservationFormValues = z.infer<typeof reservationSchema>;
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
