"use client";

import { useEffect, useState } from "react";
import { getNewsById } from "@/actions/news";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Edit } from "lucide-react";

type NewsWithRelations = {
  id: string;
  title: string;
  content: string;
  image: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      getNewsById(params.id as string).then((data) => {
        setNews(data);
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          News article not found
        </div>
        <Link
          href="/dashboard/news"
          className="inline-flex items-center mt-4 text-red-600 hover:text-red-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News List
        </Link>
      </div>
    );
  }

  // Parse BlockNote content
  let parsedContent;
  try {
    parsedContent = JSON.parse(news.content);
  } catch {
    parsedContent = null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/news"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News List
        </Link>
        <Link
          href={`/dashboard/news/${news.id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Article
        </Link>
      </div>

      {/* Article */}
      <article className="bg-white shadow rounded-lg overflow-hidden">
        {/* Featured Image */}
        {news.image && (
          <div className="w-full h-96 relative">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{news.author.name || news.author.email}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(news.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                {news.category.name}
              </span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose max-w-none">
            {parsedContent && Array.isArray(parsedContent) ? (
              parsedContent.map((block: any, index: number) => {
                if (block.type === "paragraph") {
                  return (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {block.content?.map((item: any) => item.text).join("") || ""}
                    </p>
                  );
                }
                if (block.type === "heading") {
                  const level = block.props?.level || 2;
                  const text = block.content?.map((item: any) => item.text).join("") || "";
                  const className = "font-bold text-gray-900 mt-6 mb-3";
                  
                  if (level === 1) return <h1 key={index} className={className}>{text}</h1>;
                  if (level === 2) return <h2 key={index} className={className}>{text}</h2>;
                  if (level === 3) return <h3 key={index} className={className}>{text}</h3>;
                  if (level === 4) return <h4 key={index} className={className}>{text}</h4>;
                  if (level === 5) return <h5 key={index} className={className}>{text}</h5>;
                  return <h6 key={index} className={className}>{text}</h6>;
                }
                if (block.type === "bulletListItem") {
                  return (
                    <li key={index} className="ml-6 mb-2 text-gray-700">
                      {block.content?.map((item: any) => item.text).join("") || ""}
                    </li>
                  );
                }
                return null;
              })
            ) : (
              <div className="text-gray-700 whitespace-pre-wrap">{news.content}</div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
