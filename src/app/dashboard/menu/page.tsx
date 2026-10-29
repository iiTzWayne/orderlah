import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MenuClient } from "./menu-client";

export default async function MenuPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: menu, error } = await supabase
    .from("menu_items")
    .select("id, name, price, aliases, is_active")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return <MenuClient initialItems={menu || []} />;
}

