"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/actions/analytics";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend 
} from "recharts";
import { 
  Eye, FileText, Users, TrendingUp, TrendingDown,
  Plus, FolderTree, Settings, BarChart3 
} from "lucide-react";
import Link from "next/link";

type DashboardData = {
  stats: {
    totalArticles: number;
    totalUsers: number;
    totalCategories: number;
    totalViews: number;
    thisMonthArticles: number;
    articlesChange: number;
    viewsChange: number;
    visitorsChange: number;
  };
  monthlyViews: Array<{ month: string; views: number; articles: number }>;
  categoryDistribution: Array<{ name: string; value: number; percentage: string }>;
  userGrowth: Array<{ country: string; users: number; code: string }>;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    category: { name: string };
    createdAt: Date;
  }>;
};

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const PercentageBadge = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
        isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sales Report
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Views - Primary Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] dark:from-indigo-600 dark:to-purple-700 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Eye className="w-6 h-6" />
            </div>
            <PercentageBadge value={data.stats.viewsChange} />
          </div>
          <div className="mt-4">
            <p className="text-sm opacity-90 mb-1">Total Sales</p>
            <p className="text-4xl font-bold">${(data.stats.totalViews / 1000).toFixed(3)}</p>
            <p className="text-xs opacity-75 mt-2">Products vs last month</p>
          </div>
        </div>

        {/* Total Articles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <PercentageBadge value={data.stats.articlesChange} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Articles</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats.totalArticles.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Articles vs last month</p>
          </div>
        </div>

        {/* Visitors */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <Users className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <PercentageBadge value={data.stats.visitorsChange} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Visitor</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{(data.stats.totalViews / 2).toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Users vs last month</p>
          </div>
        </div>

        {/* Published Articles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <TrendingUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <PercentageBadge value={data.stats.articlesChange} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Sold Products</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats.thisMonthArticles.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Products vs last month</p>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reading Statistics */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Product Statistic</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your product sales</p>
            </div>
            <select className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-6 space-y-3">
              {data.categoryDistribution.slice(0, 3).map((cat, index) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cat.value} articles</p>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-green-600 dark:text-green-400">
                    +{cat.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Upgrade Pro</h3>
            <p className="text-sm text-gray-400 mb-6">
              Discover the benefits of an upgraded account
            </p>
            <Link
              href="/dashboard/news/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upgrade $30
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Reading Habits Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Customer Habits</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your customer habits</p>
          </div>
          <select className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>This year</option>
            <option>Last year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.monthlyViews}>
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="views" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Views" />
            <Bar dataKey="articles" fill="#E5E7EB" radius={[8, 8, 0, 0]} name="Articles" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Growth */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Customer Growth</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track customer by locations</p>
          </div>
          <select className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Today</option>
            <option>This Week</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.userGrowth.map((location, index) => (
            <div key={location.country} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              >
                {location.users}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{location.country}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{location.users} users</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
