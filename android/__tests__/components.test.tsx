import React from 'react';
import renderer, {act} from 'react-test-renderer';
import StatCard from '../src/components/StatCard';
import {DumbbellIcon, FlameIcon, StreakIcon} from '../src/components/DashboardIcons';
import AppTabBar from '../src/components/AppTabBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MonthlyConsistencyHeatmap from '../src/components/MonthlyConsistencyHeatmap';
import FavoriteWorkoutCard from '../src/components/FavoriteWorkoutCard';

describe('components render', () => {
  it('StatCard', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<StatCard title="T" value="1" footer="f" icon={<DumbbellIcon />} iconTint="#fff" delta="+1%" deltaColor="#0f0" />);
    });
    expect(tree).toBeTruthy();
  });

  it('DashboardIcons', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<><DumbbellIcon /><FlameIcon /><StreakIcon variant="idle" /><StreakIcon variant="start" /><StreakIcon variant="building" /><StreakIcon variant="roll" /><StreakIcon variant="peak" /></>);
    });
    expect(tree).toBeTruthy();
  });

  it('AppTabBar', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<SafeAreaProvider><AppTabBar activeTab="week" onChange={() => {}} /></SafeAreaProvider>);
    });
    expect(tree).toBeTruthy();
  });

  it('MonthlyConsistencyHeatmap', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<MonthlyConsistencyHeatmap workouts={[]} monthAnchor={new Date('2026-11-01')} loading={false} />);
    });
    expect(tree).toBeTruthy();
  });

  it('FavoriteWorkoutCard', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<FavoriteWorkoutCard workout={{
        exercises: [{exercise: 'Pushup', weight: 0}],
        id: 1,
        date: '2026-11-01',
        xaxisLabel: 'Nov 1',
        time: 30,
        rounds: '3x10',
        comment: 'c',
        calories: 100,
        trainingLoad: 20,
      }} />);
    });
    expect(tree).toBeTruthy();
  });
});