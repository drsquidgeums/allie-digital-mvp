
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
  color?: string;
  category?: string;
  labels?: string[];
}
