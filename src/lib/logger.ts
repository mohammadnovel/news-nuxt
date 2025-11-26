import { appendFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type LogLevel = "INFO" | "WARN" | "ERROR";

const LOG_DIR = join(process.cwd(), "logs");
const LOG_FILE = join(LOG_DIR, "app.log");

async function ensureLogDir() {
  try {
    await mkdir(LOG_DIR, { recursive: true });
  } catch (error) {
    // Ignore error if directory already exists
  }
}

export async function log(level: LogLevel, message: string, meta?: any) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userName = session?.user?.name;
    const userEmail = session?.user?.email;

    const logEntry = {
      id: crypto.randomUUID(),
      level,
      message,
      meta: meta ? JSON.stringify(meta) : null,
      createdAt: new Date().toISOString(),
      user: userId ? {
        id: userId,
        name: userName,
        email: userEmail
      } : null
    };

    await ensureLogDir();
    await appendFile(LOG_FILE, JSON.stringify(logEntry) + "\n");
  } catch (error) {
    console.error("Failed to write log to file:", error);
    console.log(`[${level}] ${message}`, meta);
  }
}

export const logger = {
  info: (message: string, meta?: any) => log("INFO", message, meta),
  warn: (message: string, meta?: any) => log("WARN", message, meta),
  error: (message: string, meta?: any) => log("ERROR", message, meta),
};
