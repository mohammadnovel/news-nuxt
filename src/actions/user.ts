"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          news: true,
        },
      },
    },
  });
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create user. Email might already exist." };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const updateData: any = {
      name: name || null,
      email,
      role: role || "USER",
    };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);
  
  // Prevent deleting own account
  if (session?.user?.id === id) {
    return { error: "Cannot delete your own account" };
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete user. User might have associated news articles." };
  }
}
