import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { BottomNav } from "./bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white pb-20 text-neutral-900 shadow-sm dark:bg-neutral-950 dark:text-neutral-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-neutral-950/95">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400">
            OrderLah
          </h1>
          <p className="max-w-[200px] truncate text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-neutral-900"
          >
            Sign out
          </button>
        </form>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4">{children}</main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

