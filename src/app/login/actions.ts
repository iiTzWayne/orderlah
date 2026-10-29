"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const INVALID = "Enter a valid email and a password of at least 8 characters";

export async function login(formData: FormData) {
    const parsed = schema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) redirect("/login?error=" + encodeURIComponent(INVALID));

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) redirect("/login?error=" + encodeURIComponent(error.message));

    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const parsed = schema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) redirect("/login?error=" + encodeURIComponent(INVALID));

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp(parsed.data);
    if (error) redirect("/login?error=" + encodeURIComponent(error.message));

    redirect("/dashboard");
}