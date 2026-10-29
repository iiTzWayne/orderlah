import { login, signup } from "./actions";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;
    return (
        <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
            <h1 className="text-2xl font-semibold">OrderLah</h1>
            {error && <p className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}
            <form className="flex flex-col gap-3">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="rounded border border-gray-500 bg-white p-2 text-black placeholder:text-gray-500"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password (min 8)"
                    required
                    minLength={8}
                    className="rounded border border-gray-500 bg-white p-2 text-black placeholder:text-gray-500"
                />
                <button formAction={login} className="rounded bg-white p-2 text-black">
                    Sign in
                </button>
                <button formAction={signup} className="rounded border p-2">
                    Create account
                </button>
            </form>
        </main>
    );
}