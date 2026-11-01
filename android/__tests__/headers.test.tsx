import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MonthlyDashboardHeader from '../src/components/MonthlyDashboardHeader';
import WeeklyDashboardHeader from '../src/components/WeeklyDashboardHeader';

describe('dashboard headers', () => {
  it('MonthlyDashboardHeader renders without API', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<SafeAreaProvider><MonthlyDashboardHeader /></SafeAreaProvider>);
    });
    expect(tree).toBeTruthy();
  });

  it('WeeklyDashboardHeader renders without API', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<SafeAreaProvider><WeeklyDashboardHeader /></SafeAreaProvider>);
    });
    expect(tree).toBeTruthy();
  });
});