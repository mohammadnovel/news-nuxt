"use client";

import { getCategoryById, updateCategory } from "@/actions/category";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      getCategoryById(params.id as string).then((data) => {
        setCategory(data);
        setLoading(false);
      });
    }
  }, [params.id]);

  async function handleSubmit(formData: FormData) {
    if (!category) return;

    const result = await updateCategory(category.id, formData);
    if (result?.success) {
      router.push("/dashboard/categories");
    } else {
      setError(result?.error || "Failed to update category");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Category not found
        </div>
        <Link
          href="/dashboard/categories"
          className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/dashboard/categories"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={category.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 border p-2"
            />
            <p className="mt-1 text-sm text-gray-500">
              Current slug: <span className="font-mono">{category.slug}</span>
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Link
              href="/dashboard/categories"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
