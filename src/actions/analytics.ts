"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get total counts
    const [totalArticles, totalUsers, totalCategories, totalViews] = await Promise.all([
      prisma.news.count({ where: { published: true } }),
      prisma.user.count(),
      prisma.category.count(),
      prisma.news.aggregate({
        _sum: { views: true },
      }),
    ]);

    // Get this month's articles
    const thisMonthArticles = await prisma.news.count({
      where: {
        published: true,
        createdAt: { gte: thisMonthStart },
      },
    });

    // Get last month's articles for comparison
    const lastMonthArticles = await prisma.news.count({
      where: {
        published: true,
        createdAt: {
          gte: lastMonth,
          lt: thisMonthStart,
        },
      },
    });

    // Calculate percentage changes
    const articlesChange = lastMonthArticles > 0 
      ? ((thisMonthArticles - lastMonthArticles) / lastMonthArticles * 100).toFixed(1)
      : "0";

    // Get monthly views for last 12 months
    const monthlyViews = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const articles = await prisma.news.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: { views: true },
      });
      
      const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
      
      monthlyViews.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        views: totalViews,
        articles: articles.length,
      });
    }

    // Get category distribution with percentages
    const categoryStats = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: { news: true },
        },
      },
    });

    const totalCategoryArticles = categoryStats.reduce((sum, cat) => sum + cat._count.news, 0);
    const categoryDistribution = categoryStats
      .map((cat) => ({
        name: cat.name,
        value: cat._count.news,
        percentage: totalCategoryArticles > 0 
          ? ((cat._count.news / totalCategoryArticles) * 100).toFixed(1)
          : "0",
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Mock user growth by location
    const userGrowth = [
      { country: "United States", users: 2417, code: "US" },
      { country: "Germany", users: 812, code: "DE" },
      { country: "Australia", users: 2281, code: "AU" },
      { country: "France", users: 287, code: "FR" },
    ];

    // Get top articles
    const topArticles = await prisma.news.findMany({
      take: 5,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        views: true,
        category: {
          select: { name: true },
        },
        createdAt: true,
      },
    });

    return {
      stats: {
        totalArticles,
        totalUsers,
        totalCategories,
        totalViews: totalViews._sum.views || 0,
        thisMonthArticles,
        articlesChange: parseFloat(articlesChange),
        viewsChange: 12.4, // Mock percentage
        visitorsChange: -2.1, // Mock percentage
      },
      monthlyViews,
      categoryDistribution,
      userGrowth,
      topArticles,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      stats: {
        totalArticles: 0,
        totalUsers: 0,
        totalCategories: 0,
        totalViews: 0,
        thisMonthArticles: 0,
        articlesChange: 0,
        viewsChange: 0,
        visitorsChange: 0,
      },
      monthlyViews: [],
      categoryDistribution: [],
      userGrowth: [],
      topArticles: [],
    };
  }
}
