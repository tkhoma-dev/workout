import React from 'react';
import {StyleSheet, View} from 'react-native';
import MonthlyDashboardHeader from '../components/MonthlyDashboardHeader';

export default function MonthOverviewScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <MonthlyDashboardHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
