"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    // Get total counts
    const [totalArticles, totalUsers, totalCategories, totalViews] = await Promise.all([
      prisma.news.count(),
      prisma.user.count(),
      prisma.category.count(),
      prisma.news.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    // Get views over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentArticles = await prisma.news.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
        views: true,
      },
    });

    // Group by date
    const viewsByDate = recentArticles.reduce((acc: any, article) => {
      const date = article.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += article.views;
      return acc;
    }, {});

    const viewsChart = Object.entries(viewsByDate).map(([date, views]) => ({
      date,
      views,
    }));

    // Get category distribution
    const categoryStats = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            news: true,
          },
        },
      },
    });

    const categoryDistribution = categoryStats.map((cat) => ({
      name: cat.name,
      value: cat._count.news,
    }));

    // Get top articles by views
    const topArticles = await prisma.news.findMany({
      take: 5,
      orderBy: {
        views: 'desc',
      },
      select: {
        id: true,
        title: true,
        views: true,
        category: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    // Get recent articles
    const recentNews = await prisma.news.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        author: {
          select: {
            name: true,
            email: true,
          },
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
      },
      viewsChart,
      categoryDistribution,
      topArticles,
      recentNews,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      stats: {
        totalArticles: 0,
        totalUsers: 0,
        totalCategories: 0,
        totalViews: 0,
      },
      viewsChart: [],
      categoryDistribution: [],
      topArticles: [],
      recentNews: [],
    };
  }
}
