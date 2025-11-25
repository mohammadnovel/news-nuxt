"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryById(id: string) {
  try {
    return await prisma.category.findUnique({
      where: { id },
    });
  } catch (error) {
    return null;
  }
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  if (!name) {
    return { error: "Name is required" };
  }

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
      },
    });
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  if (!name) {
    return { error: "Name is required" };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete category" };
  }
}
