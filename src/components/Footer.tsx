"use client";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white mt-20 py-12 border-t border-gray-700 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            NewsHub
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} NewsHub. All Rights Reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400 dark:text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
