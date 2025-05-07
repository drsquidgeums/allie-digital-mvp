
export interface FeedbackResponse {
  id?: string;
  userId: string;
  rating: number;
  usability: number;
  visualAppeal: number;
  wouldRecommend: boolean;
  comments: string;
  createdAt?: string;
}
