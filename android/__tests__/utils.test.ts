import {classifyTrainingLoad, trainingLoadLabel} from '../src/utils/trainingLoad';
import {formatWorkoutDateLabel, formatLongWorkoutDate} from '../src/utils/workoutDateLabel';
import {buildMonthHeatmap, mondayOffsetForMonth, aggregateDailyLoad} from '../src/utils/heatmapIntensity';
import {
  workoutDayIso,
  longestConsecutiveStreak,
  activeDaysInCalendarMonth,
  longestStreakInCalendarMonth,
  longestStreakRangeInCalendarMonth,
  longestStreakInDateSpan,
  summarizeStreak,
  formatStreakDateRange,
} from '../src/utils/streak';
import * as monthPeriod from '../src/utils/monthPeriod';
import * as weekPeriodFormat from '../src/utils/weekPeriodFormat';
import * as streakPresentation from '../src/utils/streakPresentation';

describe('trainingLoad', () => {
  it('classifies loads', () => {
    expect(classifyTrainingLoad(0)).toBe('rest');
    expect(classifyTrainingLoad(10)).toBe('light');
    expect(classifyTrainingLoad(20)).toBe('moderate');
    expect(classifyTrainingLoad(40)).toBe('heavy');
    expect(trainingLoadLabel('heavy')).toBe('Heavy');
  });
});

describe('workoutDateLabel', () => {
  it('returns axis when no valid date', () => {
    expect(formatWorkoutDateLabel({xaxisLabel: 'Mon'} as any)).toBe('Mon');
  });

  it('formats long date', () => {
    expect(formatLongWorkoutDate('2026-11-01')).toMatch(/Nov/);
  });

  it('workoutDateLabel more', () => {
    const currentYear = new Date().getFullYear();
    expect(formatWorkoutDateLabel({date: `${currentYear}-01-01`, xaxisLabel: 'Axis'})).toBe('Axis');
    expect(formatWorkoutDateLabel({date: '2020-01-01', xaxisLabel: 'Axis'})).toContain('2020');
    expect(formatLongWorkoutDate('not-a-date')).toBe('');
  });
});

describe('heatmapIntensity', () => {
  it('builds month days', () => {
    const days = buildMonthHeatmap([], new Date('2026-11-01'));
    expect(days.length).toBe(30);
    expect(days[0].day).toBe(1);
  });

  it('monday offset for month', () => {
    expect(typeof mondayOffsetForMonth(new Date('2026-11-01'))).toBe('number');
  });

  it('aggregateDailyLoad and heatmap with data', () => {
    const workouts = [
      {date: '2026-11-01', trainingLoad: 10} as any,
      {date: '2026-11-02', trainingLoad: 30} as any,
      {date: '2026-10-31', trainingLoad: 5} as any,
    ];
    const daily = aggregateDailyLoad(workouts, new Date('2026-11-01'));
    expect(daily.get('2026-11-01')).toBe(10);
    const days = buildMonthHeatmap(workouts, new Date('2026-11-01'));
    expect(days.length).toBe(30);
    expect(days.find(d => d.day === 1)?.intensity).toBeDefined();
  });
});

describe('streak', () => {
  it('workoutDayIso slices date', () => {
    expect(workoutDayIso({date: '2026-11-01T10:00:00'} as any)).toBe('2026-11-01');
  });

  it('longestConsecutiveStreak counts runs', () => {
    expect(longestConsecutiveStreak(['2026-11-01', '2026-11-02', '2026-11-04'])).toBe(2);
    expect(longestConsecutiveStreak([])).toBe(0);
  });
});

describe('monthPeriod', () => {
  it('formats and parses month period', () => {
    const d = new Date('2026-11-01');
    const val = monthPeriod.formatMonthValue(d);
    expect(typeof val).toBe('string');
    expect(monthPeriod.parseMonthPeriod(val).getMonth()).toBe(10);
  });

  it('counts working days in month', () => {
    expect(monthPeriod.countWorkingDaysInMonth(new Date('2026-11-01'))).toBeGreaterThan(0);
  });

  it('monthPeriod more', () => {
    expect(monthPeriod.previousMonthPeriod('Nov 2026')).toBe('Oct 2026');
    expect(monthPeriod.monthStart(new Date('2026-11-15')).getDate()).toBe(1);
    expect(monthPeriod.isSameCalendarMonth(new Date('2026-11-01'), new Date('2026-11-30'))).toBe(true);
    expect(typeof monthPeriod.isSelectedMonthCurrent('Nov 2026')).toBe('boolean');
    expect(monthPeriod.formatMonthNameOnly(new Date('2026-11-01'))).toBe('November');
    expect(monthPeriod.isMonthInRange(new Date('2026-11-01'), '2026-01-01')).toBe(true);
    const d = monthPeriod.parseMonthPeriod('invalid');
    expect(d instanceof Date).toBe(true);
  });
});

describe('weekPeriodFormat', () => {
  it('formats dd mm yy', () => {
    expect(weekPeriodFormat.formatDdMmYy(new Date('2026-11-01'))).toMatch(/\d{2}\.\d{2}\.\d{2}/);
  });

  it('counts working days in week', () => {
    expect(weekPeriodFormat.countWorkingDaysInWeek()).toBeGreaterThan(0);
  });

  it('parses week period', () => {
    const now = weekPeriodFormat.currentWeekPeriodRange();
    const parsed = weekPeriodFormat.parseWeekPeriod(now);
    expect(parsed instanceof Date).toBe(true);
  });

  it('weekPeriodFormat more', () => {
    const monday = new Date('2026-11-02');
    expect(weekPeriodFormat.endOfIsoWeekSunday(monday).getDay()).toBe(0);
    expect(weekPeriodFormat.previousWeekPeriod(weekPeriodFormat.currentWeekPeriodRange())).toMatch(/-/);
    expect(typeof weekPeriodFormat.isSelectedWeekCurrent(weekPeriodFormat.currentWeekPeriodRange())).toBe('boolean');
    expect(weekPeriodFormat.formatWeekLabel(new Date('2026-11-01'))).toContain('2026');
    expect(weekPeriodFormat.isWeekInRange(new Date('2026-10-26'), '2025-01-01')).toBe(true);
    expect(weekPeriodFormat.parseWeekPeriod('invalid')).toBeInstanceOf(Date);
  });
});

describe('streak (more)', () => {
  const workouts = [
    {date: '2026-11-01'} as any,
    {date: '2026-11-02'} as any,
    {date: '2026-11-04'} as any,
  ];

  it('activeDaysInCalendarMonth', () => {
    expect(activeDaysInCalendarMonth(workouts, new Date('2026-11-01'))).toBe(3);
  });

  it('longestStreakInCalendarMonth', () => {
    expect(longestStreakInCalendarMonth(workouts, new Date('2026-11-01'))).toBe(2);
  });

  it('longestStreakRangeInCalendarMonth', () => {
    const r = longestStreakRangeInCalendarMonth(workouts, new Date('2026-11-01'));
    expect(r?.length).toBe(2);
  });

  it('longestStreakInDateSpan', () => {
    expect(longestStreakInDateSpan(workouts, '2026-11-01', '2026-11-30')).toBe(2);
  });

  it('summarizeStreak', () => {
    const s = summarizeStreak(workouts, '2026-11-02');
    expect(s.current).toBe(2);
    expect(s.best).toBe(2);
  });

  it('formatStreakDateRange', () => {
    expect(formatStreakDateRange('2026-11-01', '2026-11-02')).toContain('–');
  });
});

describe('streakPresentation', () => {
  it('idle when zero', () => {
    expect(streakPresentation.getStreakPresentation({current: 0, best: 0, isPersonalRecord: false}).iconVariant).toBe('idle');
  });

  it('peak for personal record', () => {
    expect(streakPresentation.getStreakPresentation({current: 3, best: 3, isPersonalRecord: true}).badgeLabel).toBe('Best');
  });

  it('range presentation empty', () => {
    expect(streakPresentation.getRangeStreakPresentation(null, 'empty').footer).toBe('empty');
  });
});