import Link from "next/link";

export default function Home() {
  return (
    <main className="text-center mt-10">
      <h1 className="text-2xl font-bold">Welcome to Mental Health Tracker</h1>
      <p className="mt-4">
        Go to <Link href="/login" className="text-blue-500 underline">Login</Link>
      </p>
    </main>
  );
}
