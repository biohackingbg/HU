import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Въведете имейл")
  .email("Невалиден имейл адрес")
  .transform((v) => v.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "Паролата трябва да е поне 8 символа")
  .max(200, "Паролата е твърде дълга");

export const registerSchema = z.object({
  firstName: z.string().trim().max(80).optional().or(z.literal("")),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Въведете парола"),
});

export const profileSchema = z.object({
  firstName: z.string().trim().max(80).optional().or(z.literal("")),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Въведете текущата парола"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Потвърдете новата парола"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Паролите не съвпадат",
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Потвърдете новата парола"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Паролите не съвпадат",
  });

export const checkoutSchema = z
  .object({
    email: emailSchema,
    phone: z.string().trim().min(6, "Въведете телефон").max(30),
    firstName: z.string().trim().min(1, "Въведете име").max(80),
    lastName: z.string().trim().max(80).optional().or(z.literal("")),
    shippingMethod: z.enum([
      "econt_address",
      "econt_office",
      "econt_machine",
    ]),
    city: z.string().trim().max(120).optional().or(z.literal("")),
    postcode: z.string().trim().max(20).optional().or(z.literal("")),
    address: z.string().trim().max(300).optional().or(z.literal("")),
    office: z.string().trim().max(300).optional().or(z.literal("")),
    paymentMethod: z.enum(["cod", "card"]),
    items: z
      .array(
        z.object({
          id: z.string().min(1),
          quantity: z.number().int().min(1).max(12),
        }),
      )
      .min(1, "Количката е празна"),
  })
  .superRefine((data, ctx) => {
    if (data.shippingMethod === "econt_address") {
      if (!data.city)
        ctx.addIssue({ path: ["city"], code: "custom", message: "Въведете град" });
      if (!data.address)
        ctx.addIssue({
          path: ["address"],
          code: "custom",
          message: "Въведете адрес",
        });
    } else if (!data.office) {
      ctx.addIssue({
        path: ["office"],
        code: "custom",
        message: "Изберете офис или автомат",
      });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;

const ORDER_STATUSES = [
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(ORDER_STATUSES),
  carrier: z.string().trim().max(80).optional().or(z.literal("")),
  trackingNo: z.string().trim().max(120).optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
