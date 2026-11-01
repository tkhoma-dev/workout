import {
  emptyWorkoutData,
  formatPercentComparisonLabel,
  buildLoadPercentDelta,
  totalTrainingLoad,
} from '../src/utils/periodComparison';

describe('periodComparison', () => {
  it('totalTrainingLoad sums finite loads', () => {
    expect(
      totalTrainingLoad([
        {trainingLoad: 10} as any,
        {trainingLoad: '5'} as any,
        {trainingLoad: 'bad'} as any,
      ]),
    ).toBe(15);
  });

  it('formatPercentComparisonLabel handles zero/previous zero/current zero', () => {
    expect(formatPercentComparisonLabel(0, 0)).toBe('0%');
    expect(formatPercentComparisonLabel(5, 0)).toBe('+100%');
    expect(formatPercentComparisonLabel(0, 5)).toBe('-100%');
    expect(formatPercentComparisonLabel(10, 10)).toBe('0%');
    expect(formatPercentComparisonLabel(12, 10)).toBe('+20%');
    expect(formatPercentComparisonLabel(8, 10)).toBe('-20%');
  });

  it('formatPercentComparisonLabel avoids -0%', () => {
    expect(formatPercentComparisonLabel(10, 10.0001)).toBe('0%');
  });

  it('buildLoadPercentDelta uses load when present', () => {
    const current = {...emptyWorkoutData(), content: [{trainingLoad: 20} as any]};
    const previous = {...emptyWorkoutData(), content: [{trainingLoad: 10} as any]};
    expect(buildLoadPercentDelta(current, previous)).toBe('+100%');
  });

  it('buildLoadPercentDelta falls back to calories', () => {
    const current = {...emptyWorkoutData(), statistics: {exerciseTime: '00:00:00', calories: 100}};
    const previous = {...emptyWorkoutData(), statistics: {exerciseTime: '00:00:00', calories: 50}};
    expect(buildLoadPercentDelta(current, previous)).toBe('+100%');
  });
});