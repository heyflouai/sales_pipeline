import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  // If user is signed in, redirect to conversations
  if (userId) {
    redirect("/conversations");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          WhatsApp Team Inbox
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Collaborative messaging platform for sales teams. Manage customer conversations,
          handoff leads seamlessly, and never lose context.
        </p>

        <SignedOut>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-in"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center justify-center gap-4">
            <p className="text-gray-700">You are signed in</p>
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
