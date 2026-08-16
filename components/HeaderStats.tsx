import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatBar from './StatBar';

interface HeaderStatsProps {
  energy: number;
  hunger: number;
  happiness: number;
}

export default function HeaderStats({ energy, hunger, happiness }: HeaderStatsProps) {
  const { width } = useWindowDimensions();
  const compactMode = width < 360;

  return (
    <View style={[styles.container, compactMode && styles.compactContainer]}>
      <StatBar
        label="Energy"
        currentValue={energy}
        color="#F2C94C"
        icon={<Ionicons name="flash" size={12} color="#C98A00" />}
      />
      <StatBar
        label="Hunger"
        currentValue={hunger}
        color="#7FBF67"
        icon={<Ionicons name="restaurant" size={12} color="#4A7A3A" />}
      />
      <StatBar
        label="Happiness"
        currentValue={happiness}
        color="#F4A0B0"
        icon={<Ionicons name="sparkles" size={12} color="#B85A73" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#F9F4EE',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(200, 180, 160, 0.25)',
  },
  compactContainer: {
    paddingHorizontal: 8,
    gap: 6,
  },
});
