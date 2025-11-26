"use server";

import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const LOG_DIR = join(process.cwd(), "logs");
const LOG_FILE = join(LOG_DIR, "app.log");

type Log = {
  id: string;
  level: string;
  message: string;
  meta: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

export async function getLogs(page = 1, limit = 20, level?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    let fileContent = "";
    try {
      fileContent = await readFile(LOG_FILE, "utf-8");
    } catch (error) {
      // If file doesn't exist, return empty logs
      return {
        logs: [],
        pagination: { total: 0, pages: 0, page: 1, limit },
      };
    }

    const lines = fileContent.trim().split("\n");
    let logs: Log[] = lines
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(log => log !== null)
      .reverse(); // Latest first

    if (level && level !== "ALL") {
      logs = logs.filter(log => log.level === level);
    }

    const total = logs.length;
    const paginatedLogs = logs.slice((page - 1) * limit, page * limit);

    return {
      logs: paginatedLogs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return {
      logs: [],
      pagination: { total: 0, pages: 0, page: 1, limit },
    };
  }
}

export async function clearLogs() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await writeFile(LOG_FILE, "");
    return { success: true };
  } catch (error) {
    console.error("Error clearing logs:", error);
    return { success: false, error: "Failed to clear logs" };
  }
}
