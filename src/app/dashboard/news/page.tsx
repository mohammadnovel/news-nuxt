"use client";

import { useEffect, useState } from "react";
import { getNews, deleteNews } from "@/actions/news";
import DataTable from "@/components/DataTable";
import Link from "next/link";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  views: number;
  createdAt: Date;
  category: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const data = await getNews();
    setNews(data as NewsItem[]);
    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const result = await deleteNews(id);
    if (result.success) {
      loadNews();
    } else {
      alert(result.error || "Failed to delete news");
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (value: string) => (
        <div className="max-w-md truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "category.name",
      label: "Category",
      sortable: true,
      render: (_: any, row: NewsItem) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.category.name}
        </span>
      ),
    },
    {
      key: "author.name",
      label: "Author",
      sortable: true,
      render: (_: any, row: NewsItem) => row.author.name || row.author.email,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "views",
      label: "Views",
      sortable: true,
      render: (value: number) => (value || 0).toLocaleString(),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, row: NewsItem) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/news/${row.id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/dashboard/news/${row.id}/edit`}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.title)}
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
        <h1 className="text-2xl font-bold text-gray-900">News Articles</h1>
        <Link
          href="/dashboard/news/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create News
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={news}
        searchPlaceholder="Search news articles..."
        defaultPageSize={10}
      />
    </div>
  );
}
