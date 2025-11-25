"use client";

import { createNews } from "@/actions/news";
import { getCategories } from "@/actions/category";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import RichTextEditor from "@/components/RichTextEditor";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CreateNewsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("upload");

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  async function handleSubmit(formData: FormData) {
    formData.set("content", content);
    
    const result = await createNews(formData);
    if (result?.success) {
      router.push("/dashboard/news");
    } else {
      alert("Failed to create news");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create News Article</h1>

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

            {imageMode === "url" ? (
              <input
                type="url"
                name="image"
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

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Publish Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
