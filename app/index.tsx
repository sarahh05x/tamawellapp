import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import HeaderStats from '../components/HeaderStats';
import PetDisplay from '../components/PetDisplay';
import { usePetLogic } from '../context/PetContext';
import { usePedometer } from '../hooks/usePedometer';
import { useAccelerometerGesture } from '../hooks/useAccelerometerGesture';
import * as Haptics from 'expo-haptics';

/**
 * Main dashboard screen that orchestrates:
 * - Pet state management via PetContext
 * - Step tracking via usePedometer (100 continuous steps → +15% Energy)
 * - Shake detection via useAccelerometerGesture (+5% Happiness)
 * - "Log Meal" button (+20% Hunger reduction, i.e., -20%)
 */
export default function DashboardScreen() {
  const { pet, setPet } = usePetLogic();
  const { steps } = usePedometer();
  const lastStepCountRef = useRef(0);
  const stepThreshold = 100;
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 19 || currentHour < 6; // 7 PM to 6 AM
  const backgroundColor = isNightTime ? '#2C3545' : '#FFFDFB';


  // Handle pedometer: track continuous steps and trigger energy boost at milestone
    useEffect(() => {
    const stepDelta = steps - lastStepCountRef.current;

    if (stepDelta >= stepThreshold) {
      // Award 15% Energy increase when 100+ continuous steps detected
      setPet((prevPet) => ({
        ...prevPet,
        energy: Math.min(100, prevPet.energy + 15),
      }));

      // Reset counter ONLY when the milestone is hit
      lastStepCountRef.current = steps;
    }
  }, [steps, setPet]);

  useEffect(() => {
  if (steps > 0 && steps % 100 === 0) 
    { // Triggers at 100, 200, 300...
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);;
    }
  }, [steps]);



  // Handle shake gesture: increase happiness by 5%
  const handleShake = () => {
    setPet((prevPet) => ({
      ...prevPet,
      happiness: Math.min(100, prevPet.happiness + 5),
    }));
  };

  useAccelerometerGesture(handleShake);

  // Handle Log Meal button: reduce hunger by 20% (interpreted as satiation increase)
  const handleLogMeal = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPet((prevPet) => ({
      ...prevPet,
      hunger: Math.max(0, prevPet.hunger - 20),
    }));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={styles.contentContainer}>
      {/* Header Stats */}
      <View style={styles.headerSection}>
        <HeaderStats
          energy={pet.energy}
          hunger={pet.hunger}
          happiness={pet.happiness}
        />
      </View>

      {/* Pet Display */}
      <PetDisplay 
        energy={pet.energy} 
        hunger={pet.hunger} 
        happiness={pet.happiness} 
      />

      {/* Step Counter Display */}
      <View style={styles.stepCounterSection}>
        <Text style={styles.stepCounterLabel}>📍 Steps Today</Text>
        <Text style={styles.stepCounterValue}>{steps}</Text>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.actionsSection}>
        <Text style={[styles.sectionTitle, isNightTime && { color: '#FDFBF7' }]}>
          Quick Actions
        </Text>
        {/* Log Meal Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.mealButton]}
          onPress={handleLogMeal}
          activeOpacity={0.7}
        >
          <Text style={styles.mealButtonIcon}>🍽️</Text>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Log Meal</Text>
            <Text style={styles.buttonSubtitle}>Feed your pet (reduces hunger by 20%)</Text>
          </View>
        </TouchableOpacity>

        {/* Shake Gesture Hint */}
        <View style={[styles.actionButton, styles.shakeButton]}>
          <Text style={styles.shakeButtonIcon}>👋</Text>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Shake to Play</Text>
            <Text style={styles.buttonSubtitle}>Device motion detected (+5% Happiness)</Text>
          </View>
        </View>

        {/* Pedometer Hint */}
        <View style={[styles.actionButton, styles.stepButton]}>
          <Text style={styles.stepButtonIcon}>👟</Text>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Keep Walking</Text>
            <Text style={styles.buttonSubtitle}>Every 100 steps = +15% Energy</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  stepCounterSection: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FDE8DC', // Replaced the invalid gradient
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(232, 132, 90, 0.2)',
  },
  stepCounterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9A8A7A',
    marginBottom: 4,
  },
  stepCounterValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3A2E28',
  },
  actionsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3A2E28',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  mealButton: {
    backgroundColor: '#FFFDFB',
    borderColor: 'rgba(200, 180, 160, 0.3)',
  },
  shakeButton: {
    backgroundColor: '#FFFDFB',
    borderColor: 'rgba(244, 160, 176, 0.2)',
  },
  stepButton: {
    backgroundColor: '#FFFDFB',
    borderColor: 'rgba(232, 132, 90, 0.2)',
  },
  mealButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  shakeButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  stepButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3A2E28',
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9A8A7A',
  },
});
