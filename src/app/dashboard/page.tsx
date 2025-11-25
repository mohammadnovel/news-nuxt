"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/actions/analytics";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { TrendingUp, FileText, Users, FolderTree, Eye, Clock, Award } from "lucide-react";
import Link from "next/link";

type DashboardData = {
  stats: {
    totalArticles: number;
    totalUsers: number;
    totalCategories: number;
    totalViews: number;
  };
  viewsChart: Array<{ date: string; views: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    category: { name: string };
    createdAt: Date;
  }>;
  recentNews: Array<{
    id: string;
    title: string;
    author: { name: string | null; email: string };
    createdAt: Date;
  }>;
};

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    {
      name: "Total Views",
      value: data.stats.totalViews.toLocaleString(),
      icon: Eye,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      name: "Total Articles",
      value: data.stats.totalArticles.toLocaleString(),
      icon: FileText,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      name: "Total Users",
      value: data.stats.totalUsers.toLocaleString(),
      icon: Users,
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100",
    },
    {
      name: "Categories",
      value: data.stats.totalCategories.toLocaleString(),
      icon: FolderTree,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Monitor your content performance and user engagement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span>Active</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-blue-600" />
            Views Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.viewsChart}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FolderTree className="w-5 h-5 mr-2 text-purple-600" />
            Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Articles */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-orange-600" />
            Top Performing Articles
          </h2>
          <div className="space-y-3">
            {data.topArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/dashboard/news/${article.id}`}
                className="block p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold">
                        {index + 1}
                      </span>
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {article.title}
                      </h3>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                        {article.category.name}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {article.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {data.recentNews.map((article) => (
              <Link
                key={article.id}
                href={`/dashboard/news/${article.id}`}
                className="block p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <h3 className="font-medium text-gray-900 line-clamp-1">
                  {article.title}
                </h3>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <span>
                    by {article.author.name || article.author.email}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
