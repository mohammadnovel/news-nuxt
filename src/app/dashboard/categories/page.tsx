"use client";

import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "@/actions/category";
import DataTable from "@/components/DataTable";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data as Category[]);
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const result = await deleteCategory(id);
    if (result.success) {
      loadCategories();
    } else {
      alert(result.error || "Failed to delete category");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, row: Category) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/categories/${row.id}/edit`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Link
          href="/dashboard/categories/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchPlaceholder="Search categories..."
        defaultPageSize={10}
      />
    </div>
  );
}
