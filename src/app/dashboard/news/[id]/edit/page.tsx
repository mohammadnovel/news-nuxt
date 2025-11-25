"use client";

import { updateNews, getNewsById } from "@/actions/news";
import { getCategories } from "@/actions/category";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type NewsWithRelations = {
  id: string;
  title: string;
  content: string;
  image: string | null;
  categoryId: string;
};

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<NewsWithRelations | null>(null);
  const [content, setContent] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCategories(),
      params.id ? getNewsById(params.id as string) : null,
    ]).then(([cats, newsData]) => {
      setCategories(cats);
      if (newsData) {
        setNews(newsData);
        setContent(newsData.content);
        setImageMode(newsData.image?.startsWith("http") ? "url" : "upload");
      }
      setLoading(false);
    });
  }, [params.id]);

  async function handleSubmit(formData: FormData) {
    if (!news) return;

    formData.set("content", content);
    
    const result = await updateNews(news.id, formData);
    if (result?.success) {
      router.push("/dashboard/news");
    } else {
      alert("Failed to update news");
    }
  }

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/dashboard/news"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit News Article</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={news.title}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 border p-2"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="categoryId"
              id="categoryId"
              defaultValue={news.categoryId}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 border p-2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  imageMode === "upload"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  imageMode === "url"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Image URL
              </button>
            </div>

            {/* Current Image Preview */}
            {news.image && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <img
                  src={news.image}
                  alt="Current"
                  className="w-48 h-32 object-cover rounded border"
                />
              </div>
            )}

            {imageMode === "url" ? (
              <input
                type="url"
                name="image"
                defaultValue={news.image?.startsWith("http") ? news.image : ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 border p-2"
                placeholder="https://example.com/image.jpg"
              />
            ) : (
              <input
                type="file"
                name="file"
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Link
              href="/dashboard/news"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Update Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
