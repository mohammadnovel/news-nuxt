"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { getNews, searchNews } from "@/actions/news";
import { getCategories } from "@/actions/category";
import Link from "next/link";
import { blockNoteToText } from "@/lib/blocknote";
import { Eye, Search, TrendingUp, Clock, Loader2 } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image: string | null;
  views: number;
  createdAt: Date;
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

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function Home() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [displayedNews, setDisplayedNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 9;

  // Initial load
  useEffect(() => {
    Promise.all([getNews(), getCategories()]).then(([newsData, categoriesData]) => {
      const newsArray = newsData as NewsItem[];
      setAllNews(newsArray);
      setDisplayedNews(newsArray.slice(0, ITEMS_PER_PAGE));
      setCategories(categoriesData);
      setHasMore(newsArray.length > ITEMS_PER_PAGE);
      setLoading(false);
    });
  }, []);

  // Load more news
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newItems = allNews.slice(startIndex, endIndex);

      if (newItems.length > 0) {
        setDisplayedNews((prev) => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(endIndex < allNews.length);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    }, 500); // Small delay for better UX
  }, [allNews, page, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loadingMore]);

  const handleSearch = async (query: string, category: string) => {
    setLoading(true);
    const results = await searchNews(query, category);
    const newsArray = results as NewsItem[];
    setAllNews(newsArray);
    setDisplayedNews(newsArray.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(newsArray.length > ITEMS_PER_PAGE);
    setLoading(false);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory]);

  const [featuredNews, ...restNews] = displayedNews;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Discover Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest news from around the world
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles by title, content, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 ${
                selectedCategory === category.slug
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : displayedNews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No articles found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredNews && (
              <Link href={`/news/${featuredNews.id}`} className="block mb-12">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 bg-white group">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-96 md:h-full overflow-hidden">
                      {featuredNews.image ? (
                        <img
                          src={featuredNews.image}
                          alt={featuredNews.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-8xl">📰</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          FEATURED
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4 w-fit">
                        {featuredNews.category.name}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-3">
                        {featuredNews.title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-6 line-clamp-3">
                        {blockNoteToText(featuredNews.content)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {featuredNews.author.name || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(featuredNews.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {(featuredNews.views || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Latest News Grid */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                Latest Stories
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {restNews.map((item) => {
                const plainText = blockNoteToText(item.content);
                return (
                  <Link key={item.id} href={`/news/${item.id}`}>
                    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col group">
                      {/* Image */}
                      {item.image && (
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 mb-3 w-fit">
                          {item.category.name}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                          {plainText}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 pt-4 border-t border-gray-100">
                          <span className="font-medium text-gray-900">
                            {item.author.name || "Unknown"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 ml-auto">
                            <Eye className="w-3 h-3" />
                            {(item.views || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            {/* Infinite Scroll Observer Target */}
            <div ref={observerTarget} className="py-8">
              {loadingMore && (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <p className="mt-2 text-gray-600">Loading more articles...</p>
                </div>
              )}
              {!hasMore && displayedNews.length > 0 && (
                <div className="text-center text-gray-500">
                  <p>You've reached the end! 🎉</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              NewsHub
            </div>
            <p className="text-gray-400 text-sm">© 2025 NewsHub. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
