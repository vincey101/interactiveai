"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Welcome to My App</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">This is the home page of the application.</p>
        <Link 
          href="/projects/create-avatar" 
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Interactive Avatar
        </Link>
      </div>
    </main>
  );
}
