export interface SearchResult {
  videoTitle: string;
  videoUrl: string;
  timestamp: string;
  timestampSeconds: number;
  summary: string;
  channelName?: string;
  relevancy?: number;
}

export interface SearchResponse {
  answerSummary?: string;
  results: SearchResult[];
}
