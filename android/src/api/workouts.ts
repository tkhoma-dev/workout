import type {
  FirstWorkoutDateResponse,
  WorkoutData,
  WorkoutType,
} from '../types/workout';
import {apiUrl} from './http';

export async function fetchFirstWorkoutDate(): Promise<FirstWorkoutDateResponse> {
  const response = await fetch(apiUrl('/api/first_workout_date'), {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });

  if (!response.ok) {
    throw new Error('Failed to fetch first workout date');
  }

  return response.json() as Promise<FirstWorkoutDateResponse>;
}

export async function loadMonthWorkouts(
  startOfPeriod: string,
): Promise<WorkoutData> {
  const response = await fetch(apiUrl('/api/workouts'), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      timePeriod: 'MONTH',
      startOfPeriod,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to load workouts for this month');
  }

  return response.json() as Promise<WorkoutData>;
}

export async function fetchFavorites(): Promise<WorkoutType[]> {
  const response = await fetch(apiUrl('/api/favorites'), {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });

  if (!response.ok) {
    throw new Error('Failed to load favorite workouts');
  }

  return response.json() as Promise<WorkoutType[]>;
}

export async function fetchFlaggedDays(): Promise<string[]> {
  const response = await fetch(apiUrl('/api/add_flagged'), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: '',
  });

  if (!response.ok) {
    throw new Error('Failed to load flagged days');
  }

  const result = await response.json();
  return Array.isArray(result) ? result : [];
}

export async function toggleFlaggedDay(day: string): Promise<string[]> {
  const response = await fetch(apiUrl('/api/add_flagged'), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: day,
  });

  if (!response.ok) {
    throw new Error('Failed to update flagged day');
  }

  const result = await response.json();
  return Array.isArray(result) ? result : [];
}

export const fetchFlagged = fetchFlaggedDays;
export const getFlaggedDays = fetchFlaggedDays;
export const loadFlaggedDays = fetchFlaggedDays;
export const fetchFavoriteDays = fetchFlaggedDays;
export const toggleFlagged = toggleFlaggedDay;
export const addFlaggedDay = toggleFlaggedDay;
export const toggleFavoriteDay = toggleFlaggedDay;

export async function loadWeekWorkouts(
  startOfPeriod: string,
): Promise<WorkoutData> {
  const response = await fetch(apiUrl('/api/workouts'), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      timePeriod: 'WEEK',
      startOfPeriod,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to load workouts for this week');
  }

  return response.json() as Promise<WorkoutData>;
}
