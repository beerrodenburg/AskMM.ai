import { extractYouTubeVideoId } from "@/lib/utils";

interface VideoEmbedProps {
  videoUrl: string;
  timestampSeconds: number;
  title?: string;
}

export function VideoEmbed({ videoUrl, timestampSeconds, title }: VideoEmbedProps) {
  const videoId = extractYouTubeVideoId(videoUrl);

  if (!videoId) {
    return null;
  }

  const startParam = timestampSeconds > 0 ? `?start=${timestampSeconds}` : "";
  const embedSrc = `https://www.youtube.com/embed/${videoId}${startParam}`;

  return (
    <div className="relative w-full overflow-hidden rounded-t-[9px] bg-[var(--surface)]">
      <div className="aspect-video">
        <iframe
          src={embedSrc}
          title={title || "YouTube video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
