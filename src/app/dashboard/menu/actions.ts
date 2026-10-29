"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(80, "Name cannot exceed 80 characters");

const priceSchema = z.coerce
  .number()
  .positive("Price must be greater than 0")
  .max(9999.99, "Price cannot exceed 9999.99")
  .transform((val) => Math.round(val * 100) / 100);

const aliasesSchema = z
  .string()
  .optional()
  .default("")
  .transform((val, ctx) => {
    const rawList = val
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const seen = new Set<string>();
    const deduplicated: string[] = [];

    for (const item of rawList) {
      if (item.length > 40) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each alias cannot exceed 40 characters",
        });
        return z.NEVER;
      }
      const lower = item.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        deduplicated.push(item);
      }
    }

    if (deduplicated.length > 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At most 15 aliases allowed",
      });
      return z.NEVER;
    }

    return deduplicated;
  });

const addSchema = z.object({
  name: nameSchema,
  price: priceSchema,
  aliases: aliasesSchema,
});

const updateSchema = z.object({
  id: z.string().uuid("Invalid item ID"),
  name: nameSchema,
  price: priceSchema,
  aliases: aliasesSchema,
});

const toggleSchema = z.object({
  id: z.string().uuid("Invalid item ID"),
  is_active: z
    .enum(["true", "false"])
    .transform((val) => val === "true"),
});

export async function addMenuItemAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = addSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { error } = await supabase.from("menu_items").insert({
    name: parsed.data.name,
    price: parsed.data.price,
    aliases: parsed.data.aliases,
    is_active: true,
  });

  if (error) {
    return { ok: false, error: "Failed to add menu item. Please try again." };
  }

  revalidatePath("/dashboard/menu");
  return { ok: true };
}

export async function updateMenuItemAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { data, error } = await supabase
    .from("menu_items")
    .update({
      name: parsed.data.name,
      price: parsed.data.price,
      aliases: parsed.data.aliases,
    })
    .eq("id", parsed.data.id)
    .select("id");

  if (error) {
    return { ok: false, error: "Failed to update menu item. Please try again." };
  }

  if (!data || data.length === 0) {
    return { ok: false, error: "Item not found or permission denied" };
  }

  revalidatePath("/dashboard/menu");
  return { ok: true };
}

export async function toggleMenuItemStatusAction(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = toggleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { data, error } = await supabase
    .from("menu_items")
    .update({
      is_active: parsed.data.is_active,
    })
    .eq("id", parsed.data.id)
    .select("id");

  if (error) {
    return { ok: false, error: "Failed to update item status. Please try again." };
  }

  if (!data || data.length === 0) {
    return { ok: false, error: "Item not found or permission denied" };
  }

  revalidatePath("/dashboard/menu");
  return { ok: true };
}
