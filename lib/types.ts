export interface SlidePlan {
  id: string;
  title: string;
  audience: string;
  durationMinutes: number;
  keywords?: string;
  outlineMarkdown: string;
  createdAt: Date;
}

export interface SlidePlanInput {
  title: string;
  audience: string;
  durationMinutes: number;
  keywords?: string;
}
