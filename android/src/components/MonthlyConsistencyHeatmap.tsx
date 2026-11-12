import React, {useEffect, useMemo, useRef} from 'react';
import {PanResponder, Pressable, StyleSheet, Text, View} from 'react-native';
import type {WorkoutType} from '../types/workout';
import {colors} from '../theme';
import {
  buildMonthHeatmap,
  normalizeFlaggedDays,
  type HeatmapDay,
  type HeatmapIntensity,
  mondayOffsetForMonth,
} from '../utils/heatmapIntensity';

function localIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const INTENSITY_COLORS: Record<HeatmapIntensity, string> = {
  rest: colors.heatmapRest,
  light: colors.heatmapLight,
  moderate: colors.heatmapModerate,
  heavy: colors.heatmapHeavy,
};

const INTENSITY_TEXT: Record<HeatmapIntensity, string> = {
  rest: colors.heatmapRestText,
  light: colors.heatmapActiveText,
  moderate: colors.heatmapActiveText,
  heavy: colors.heatmapHeavyText,
};

type MonthlyConsistencyHeatmapProps = {
  workouts: WorkoutType[];
  monthAnchor: Date;
  loading?: boolean;
  flaggedDays?: unknown;
  favoriteDays?: unknown;
  flagged?: unknown;
  favorite?: unknown;
  favorites?: unknown;
  days?: unknown;
  onShift?: (delta: number) => void;
};

export default function MonthlyConsistencyHeatmap({
  workouts,
  monthAnchor,
  loading = false,
  flaggedDays,
  favoriteDays,
  flagged,
  favorite,
  favorites,
  days,
  onShift,
}: MonthlyConsistencyHeatmapProps): React.JSX.Element {
  const flaggedDayList = useMemo(
    () =>
      Array.from(
        new Set([
          ...normalizeFlaggedDays(flaggedDays),
          ...normalizeFlaggedDays(favoriteDays),
          ...normalizeFlaggedDays(flagged),
          ...normalizeFlaggedDays(favorite),
          ...normalizeFlaggedDays(favorites),
          ...normalizeFlaggedDays(days),
        ]),
      ),
    [flaggedDays, favoriteDays, flagged, favorite, favorites, days],
  );

  const flaggedSet = useMemo(() => new Set(flaggedDayList), [flaggedDayList]);

  const onShiftRef = useRef(onShift);
  const touchStartX = useRef<number | null>(null);
  useEffect(() => {
    onShiftRef.current = onShift;
  }, [onShift]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (_evt, gesture) =>
        Math.abs(gesture.dx) > 12 &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (_evt, gesture) => {
        const shift = onShiftRef.current;
        if (!shift) {
          return;
        }
        if (gesture.dx > 40) {
          shift(-1);
        } else if (gesture.dx < -40) {
          shift(1);
        }
      },
    }),
  ).current;

  const heatmapDays = useMemo(
    () => buildMonthHeatmap(workouts, monthAnchor, flaggedDayList),
    [workouts, monthAnchor, flaggedDayList],
  );

  const todayIso = localIsoDate(new Date());

  const leadingBlanks = useMemo(
    () => mondayOffsetForMonth(monthAnchor),
    [monthAnchor],
  );

  const cells = useMemo(() => {
    const items: Array<HeatmapDay | null> = [];
    for (let i = 0; i < leadingBlanks; i++) {
      items.push(null);
    }
    for (const day of heatmapDays) {
      items.push(day);
    }
    while (items.length % 7 !== 0) {
      items.push(null);
    }
    return items;
  }, [heatmapDays, leadingBlanks]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.calendarGlyph}>📅</Text>
          <Text style={styles.title}>MONTHLY CONSISTENCY HEATMAP</Text>
        </View>
        <Text style={styles.hint}>Tap date for log</Text>
      </View>
      <Text style={styles.monthLabel}>
        {monthAnchor.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        })}
      </Text>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((label, index) => (
          <Text key={`${label}-${index}`} style={styles.weekday}>
            {label}
          </Text>
        ))}
      </View>

      <View
        style={styles.grid}
        {...panResponder.panHandlers}
        onTouchStart={e => {
          touchStartX.current = e.nativeEvent.pageX;
        }}
        onTouchEnd={e => {
          if (touchStartX.current == null) {
            return;
          }
          const dx = e.nativeEvent.pageX - touchStartX.current;
          const shift = onShiftRef.current;
          if (shift && dx > 40) {
            shift(-1);
          } else if (shift && dx < -40) {
            shift(1);
          }
          touchStartX.current = null;
        }}>
        {cells.map((cell, index) => {
          if (!cell) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }

          const bg = INTENSITY_COLORS[cell.intensity];
          const textColor = INTENSITY_TEXT[cell.intensity];
          const isToday = cell.iso === todayIso;
const isFlagged =
  cell.flagged === true ||
  cell.favorite === true ||
  cell.isFlagged === true ||
  cell.isFavorite === true ||
  flaggedSet.has(cell.iso);

          return (
            <Pressable
              key={cell.iso}
              accessibilityLabel={`Day ${cell.day}${isToday ? ', today' : ''}, training load ${cell.trainingLoad}${isFlagged ? ', favorite flagged' : ''}`}
              style={[
                styles.cell,
                styles.dayCell,
                {backgroundColor: bg},
                isToday && styles.todayCell,
              ]}
              onPress={() => {
                // Placeholder for workout log navigation.
              }}>
{isFlagged ? <Text style={styles.flag}>🚩</Text> : null}
              <Text style={[styles.dayNumber, {color: textColor}]}>
                {loading ? '·' : cell.day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <Text style={styles.legendLabel}>Intensity:</Text>
        {(['rest', 'light', 'moderate', 'heavy'] as HeatmapIntensity[]).map(
          level => (
            <View key={level} style={styles.legendItem}>
              <View
                style={[
                  styles.legendSwatch,
                  {backgroundColor: INTENSITY_COLORS[level]},
                ]}
              />
              <Text style={styles.legendText}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarGlyph: {
    fontSize: 16,
  },
  title: {
    flex: 1,
    color: colors.accentBlue,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  hint: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: '500',
  },
  monthLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  dayCell: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCell: {
    borderWidth: 2,
    borderColor: colors.accentBlue,
  },
  flag: {
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  legendLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: '500',
  },
});
