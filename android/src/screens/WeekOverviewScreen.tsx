import React from 'react';
import {StyleSheet, View} from 'react-native';
import WeeklyDashboardHeader from '../components/WeeklyDashboardHeader';

export default function WeekOverviewScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <WeeklyDashboardHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
