import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Article Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the news article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
