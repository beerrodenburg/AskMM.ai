import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1) || null;
    }
  } catch {
    // Invalid URL
  }
  return null;
}
