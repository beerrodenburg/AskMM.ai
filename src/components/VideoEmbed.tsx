"use client";

import { useState, useCallback } from "react";
import { Play } from "lucide-react";
import { extractYouTubeVideoId } from "@/lib/utils";

interface VideoEmbedProps {
  videoUrl: string;
  timestampSeconds: number;
  title?: string;
}

export function VideoEmbed({ videoUrl, timestampSeconds, title }: VideoEmbedProps) {
  const videoId = extractYouTubeVideoId(videoUrl);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  if (!videoId) {
    return null;
  }

  const startParam = timestampSeconds > 0 ? `?start=${timestampSeconds}&autoplay=1` : "?autoplay=1";
  const embedSrc = `https://www.youtube.com/embed/${videoId}${startParam}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="relative w-full overflow-hidden rounded-t-[9px] bg-[var(--surface)]">
      <div className="aspect-video">
        {isPlaying ? (
          <iframe
            src={embedSrc}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${title || "video"}`}
            className="absolute inset-0 w-full h-full cursor-pointer group bg-black"
          >
            <img
              src={thumbnailUrl}
              alt={title || "YouTube video thumbnail"}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:bg-red-700 transition-colors">
                <Play size={28} className="text-white ml-1" fill="white" />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
