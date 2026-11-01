import React from 'react';
import renderer from 'react-test-renderer';
import PeriodOverview from '../src/components/PeriodOverview';
import {emptyWorkoutData} from '../src/utils/periodComparison';

describe('PeriodOverview', () => {
  it('renders loading state', () => {
    const tree = renderer.create(
      <PeriodOverview
        title="Month"
        subtitle="x"
        previousAccessibilityLabel="prev"
        nextAccessibilityLabel="next"
        canGoPrevious
        canGoNext
        onShift={() => {}}
        loading
        error={null}
        workouts={emptyWorkoutData()}
        previousWorkouts={emptyWorkoutData()}
        periodNoun="month"
        workoutGoalFooter="Goal"
        streakCardTitle="Streak"
        streakValue="0 Days"
        streakPresentation={{badgeLabel: null, iconVariant: 'idle', footer: ''} as any}
        heatmapWorkouts={[]}
        monthAnchor={new Date('2026-11-01')}
      />,
    );
    expect(tree).toBeTruthy();
  });

  it('renders with negative deltas (down arrow path)', () => {
    const prev = {...emptyWorkoutData(), content: [{trainingLoad: 10} as any], statistics: {exerciseTime: '01:00:00', calories: 10}};
    const curr = {...emptyWorkoutData(), content: [{trainingLoad: 5} as any], statistics: {exerciseTime: '00:30:00', calories: 5}, totalElements: 1};
    const tree = renderer.create(
      <PeriodOverview
        title="Week"
        subtitle="x"
        previousAccessibilityLabel="prev"
        nextAccessibilityLabel="next"
        canGoPrevious
        canGoNext
        onShift={() => {}}
        loading={false}
        error={null}
        workouts={curr}
        previousWorkouts={prev}
        periodNoun="week"
        workoutGoalFooter="Goal"
        streakCardTitle="Streak"
        streakValue="1 Day"
        streakPresentation={{badgeLabel: null, iconVariant: 'idle', footer: ''} as any}
        heatmapWorkouts={[]}
        monthAnchor={new Date('2026-11-01')}
      />,
    );
    expect(tree).toBeTruthy();
  });
});