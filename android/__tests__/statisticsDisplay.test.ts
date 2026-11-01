import {
  formatGroupedNumber,
  parseExerciseTimeToMinutes,
  formatExerciseTimeHhMm,
  formatMinutesAsHhMm,
  formatMinutesAsMmSs,
  formatTimeDeltaHhMm,
  formatAvgCaloriesPerSession,
  formatAvgMinutesPerSession,
} from '../src/utils/statisticsDisplay';

describe('statisticsDisplay', () => {
  it('formatGroupedNumber groups digits', () => {
    expect(formatGroupedNumber(1234567)).toBe('1\u00a0234\u00a0567');
    expect(formatGroupedNumber(0)).toBe('0');
    expect(formatGroupedNumber('')).toBe('0');
  });

  it('parseExerciseTimeToMinutes parses HH:MM:SS', () => {
    expect(parseExerciseTimeToMinutes('01:30:00')).toBe(90);
    expect(parseExerciseTimeToMinutes('00:00:00')).toBe(0);
  });

  it('formatExerciseTimeHhMm trims seconds', () => {
    expect(formatExerciseTimeHhMm('01:05:30')).toBe('01:05');
  });

  it('formatMinutesAsHhMm formats absolute minutes', () => {
    expect(formatMinutesAsHhMm(90)).toBe('01:30');
    expect(formatMinutesAsHhMm(-90)).toBe('01:30');
  });

  it('formatTimeDeltaHhMm signs correctly', () => {
    expect(formatTimeDeltaHhMm('01:30:00', '01:00:00')).toBe('+00:30');
    expect(formatTimeDeltaHhMm('01:00:00', '01:30:00')).toBe('-00:30');
    expect(formatTimeDeltaHhMm('01:00:00', '01:00:00')).toBe('+00:00');
  });

  it('more display helpers', () => {
    expect(formatMinutesAsMmSs(1.5)).toMatch(/:/);
    const data: any = {totalElements: 2, statistics: {calories: 100, exerciseTime: '01:00:00'}};
    expect(formatAvgCaloriesPerSession(data)).toContain('Avg');
    expect(formatAvgMinutesPerSession(data)).toContain('Avg');
    const empty: any = {totalElements: 0, statistics: {calories: 0, exerciseTime: '00:00:00'}};
    expect(formatAvgCaloriesPerSession(empty)).toContain('No sessions');
  });
});