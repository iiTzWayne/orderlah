import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: menu, error } = await supabase
        .from("menu_items")
        .select("id, name, price, aliases")
        .order("name");
    if (error) throw new Error(error.message);

    return (
        <main className="mx-auto max-w-xl p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Menu</h1>
                <form action={signOut}><button className="text-sm underline">Sign out</button></form>
            </div>
            <p className="text-sm text-gray-400">{user.email}</p>
            <ul className="mt-4 divide-y divide-gray-700">
                {menu?.map((m) => (
                    <li key={m.id} className="py-2">
                        <div className="flex justify-between">
                            <span>{m.name}</span>
                            <span>RM {Number(m.price).toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-400">{m.aliases.join(", ")}</div>
                    </li>
                ))}
            </ul>
        </main>
    );
}