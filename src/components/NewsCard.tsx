import Link from "next/link";
import Image from "next/image";
import { blockNoteToText } from "@/lib/blocknote";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    content: string;
    image: string | null;
    createdAt: Date;
    category: {
      name: string;
    };
    author: {
      name: string | null;
    };
  };
}

export function NewsCard({ news }: NewsCardProps) {
  const plainText = blockNoteToText(news.content);
  
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-[1.02] bg-white h-full">
      <div className="flex-shrink-0 relative h-48 w-full bg-gray-200">
        {news.image ? (
          <img
            className="h-full w-full object-cover"
            src={news.image}
            alt={news.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-4xl">📰</span>
          </div>
        )}
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-red-600">
            {news.category.name}
          </p>
          <Link href={`/news/${news.id}`} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900 line-clamp-2">
              {news.title}
            </p>
            <p className="mt-3 text-base text-gray-500 line-clamp-3">
              {plainText}
            </p>
          </Link>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <span className="sr-only">{news.author.name}</span>
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
              {news.author.name?.[0] || "A"}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {news.author.name || "Unknown Author"}
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={news.createdAt.toISOString()}>
                {new Date(news.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
