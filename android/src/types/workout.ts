export type WorkoutType = {
  exercises: {
    exercise: string;
    weight: number;
    order?: number;
  }[];
  id: unknown;
  date: string;
  xaxisLabel: string;
  time: number;
  rounds: string;
  comment: string;
  calories?: number;
  trainingLoad?: number;
  favorite?: boolean;
};

export type WorkoutData = {
  statistics: {
    exerciseTime: string;
    calories: number;
  };
  content: WorkoutType[];
  totalElements: number;
};

export type FirstWorkoutDateResponse = {
  firstDate: string;
};
