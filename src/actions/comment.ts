"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCommentsByNewsId(newsId: string) {
  return await prisma.comment.findMany({
    where: {
      newsId,
      parentId: null, // Only get top-level comments
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createComment(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { error: "You must be logged in to comment" };
  }

  const content = formData.get("content") as string;
  const newsId = formData.get("newsId") as string;
  const parentId = formData.get("parentId") as string | null;

  if (!content || !newsId) {
    return { error: "Content and news ID are required" };
  }

  if (content.trim().length < 1) {
    return { error: "Comment cannot be empty" };
  }

  try {
    await prisma.comment.create({
      data: {
        content: content.trim(),
        newsId,
        authorId: session.user.id,
        parentId: parentId || null,
      },
    });

    revalidatePath(`/news/${newsId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to post comment" };
  }
}

export async function deleteComment(id: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    // Get comment to check ownership
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true, newsId: true },
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    // Only allow author or admin to delete
    if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "You can only delete your own comments" };
    }

    await prisma.comment.delete({
      where: { id },
    });

    revalidatePath(`/news/${comment.newsId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete comment" };
  }
}
