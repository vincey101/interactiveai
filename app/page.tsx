"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to My App</h1>
      <p className="mb-4">This is the home page of the application.</p>
      <a 
        href="/interactiveAvatar" 
        className="text-blue-500 hover:text-blue-700 underline"
      >
        Go to Interactive Avatar
      </a>
    </main>
  );
}
