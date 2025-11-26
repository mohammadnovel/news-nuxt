"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getNews() {
  return await prisma.news.findMany({
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

import { writeFile } from "fs/promises";
import { join } from "path";

import { logger } from "@/lib/logger";

export async function createNews(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
      await logger.warn("Unauthorized attempt to create news");
      return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  let image = formData.get("image") as string;
  const file = formData.get("file") as File | null;

  if (!title || !content || !categoryId) {
    return { error: "Missing required fields" };
  }

  // Handle file upload
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
    const path = join(process.cwd(), "public/uploads", filename);
    
    try {
      await writeFile(path, buffer);
      image = `/uploads/${filename}`;
    } catch (error) {
      console.error("Error saving file:", error);
      await logger.error("Failed to upload image during news creation", { error: String(error) });
      return { error: "Failed to upload image" };
    }
  }

  try {
    const news = await prisma.news.create({
      data: {
        title,
        content,
        image: image || null,
        categoryId,
        authorId: session.user.id,
        published: true,
      },
    });

    await logger.info(`News created: ${title}`, { newsId: news.id, authorId: session.user.id });
    revalidatePath("/dashboard/news");
    revalidatePath("/news");
    return { success: true, news };
  } catch (error) {
    console.error("Error creating news:", error);
    await logger.error("Failed to create news", { error: String(error) });
    return { error: "Failed to create news" };
  }
}

export async function getNewsById(id: string) {
  try {
    return await prisma.news.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function updateNews(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  let image = formData.get("image") as string;
  const file = formData.get("file") as File | null;

  if (!title || !content || !categoryId) {
    return { error: "Missing required fields" };
  }

  // Handle file upload
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
    const path = join(process.cwd(), "public/uploads", filename);
    
    try {
      await writeFile(path, buffer);
      image = `/uploads/${filename}`;
    } catch (error) {
      console.error("Error saving file:", error);
      return { error: "Failed to upload image" };
    }
  }

  try {
    await prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        image: image || undefined,
        categoryId,
      },
    });
    revalidatePath("/dashboard/news");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update news" };
  }
}

export async function deleteNews(id: string) {
  try {
    await prisma.news.delete({
      where: { id },
    });
    revalidatePath("/dashboard/news");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete news" };
  }
}

export async function incrementNewsViews(id: string) {
  try {
    await prisma.news.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Failed to increment views:", error);
  }
}

export async function searchNews(query: string, categorySlug?: string) {
  const whereClause: any = {
    published: true,
  };

  // Add category filter if provided
  if (categorySlug && categorySlug !== "all") {
    whereClause.category = {
      slug: categorySlug,
    };
  }

  // Add search query if provided
  if (query) {
    whereClause.OR = [
      {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        category: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  return await prisma.news.findMany({
    where: whereClause,
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
