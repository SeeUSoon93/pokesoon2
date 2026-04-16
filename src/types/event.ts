export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startAt: string;
  endAt: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
};
