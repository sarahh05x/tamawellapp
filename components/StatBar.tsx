import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface StatBarProps {
  label: string;
  currentValue: number;
  color: string;
  icon: React.ReactNode;
}

const clampValue = (value: number) => Math.min(100, Math.max(0, value));

export default function StatBar({ label, currentValue, color, icon }: StatBarProps) {
  const safeValue = clampValue(currentValue);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: safeValue,
      duration: 420,
      useNativeDriver: false,
    }).start();
  }, [safeValue, widthAnim]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}26` }]}>{icon}</View>
        <Text 
          style={styles.label}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
        >
          {label}
        </Text>
        <Text style={styles.value}>{Math.round(safeValue)}%</Text>
      </View>

      <View style={[styles.track, { backgroundColor: `${color}22` }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: '#FFFDFB',
    borderWidth: 1,
    borderColor: 'rgba(200, 180, 160, 0.22)',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#5A4E43',
  },
  value: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7A6A5A',
    minWidth: 28,
    textAlign: 'right',
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
