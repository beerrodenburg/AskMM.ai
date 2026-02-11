export interface SearchResult {
  videoTitle: string;
  videoUrl: string;
  timestamp: string;
  timestampSeconds: number;
  summary: string;
  channelName?: string;
}

export interface SearchResponse {
  answerSummary?: string;
  results: SearchResult[];
}
