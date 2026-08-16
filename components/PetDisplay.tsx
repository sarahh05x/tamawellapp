import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';

interface PetDisplayProps {
  energy: number;
  hunger: number;
  happiness: number;
}

type PetMood = 'Happy' | 'Sad' | 'Asleep';

const PetDisplay: React.FC<PetDisplayProps> = ({ energy, hunger, happiness }) => {
  // Determine pet mood based on stats
  const determineMood = (): PetMood => {
    if (energy < 10) {
      return 'Asleep';
    }
    if (energy < 30 || hunger < 30 || happiness < 30) {
      return 'Sad';
    }
    return 'Happy';
  };

  const mood = determineMood();

  // Animation values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [isShaking, setIsShaking] = useState(false);

  const { height, width } = useWindowDimensions();

  // Breathing bounce animation (looping)
  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    breathing.start();

    return () => breathing.stop();
  }, [bounceAnim]);

  // Accelerometer listener for shake detection
  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      // Detect shake by checking magnitude of acceleration
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // Threshold for shake detection (adjust based on sensitivity)
      if (magnitude > 3.5 && !isShaking) {
        setIsShaking(true);

        // Trigger fast surprise bounce
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: -20,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -15,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsShaking(false);
        });
      }
    });

    return () => subscription.remove();
  }, [isShaking, shakeAnim]);

  // Get pet image based on mood
  const getPetImage = (): any => {
    switch (mood) {
      case 'Asleep':
        return require('../assets/pet-asleep.png');
      case 'Sad':
        return require('../assets/pet-sad.png');
      case 'Happy':
      default:
        return require('../assets/pet-happy.png');
    }
  };

  // Combine breathing and shake animations
  const translateY = Animated.add(bounceAnim, shakeAnim);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.petWrapper,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <Image
          source={getPetImage()}
          style={[
            styles.petImage,
            {
              width: width * 0.4,
              height: width * 0.4,
              maxWidth: 140,
              maxHeight: 140,
            },
          ]}
          resizeMode="contain"
          testID={`pet-image-${mood}`}
        />
      </Animated.View>

      {/* Status indicator */}
      <View style={styles.moodBadge}>
        <View style={[styles.moodDot, { backgroundColor: getMoodColor(mood) }]} />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#5A4E43' }}>{mood}</Text>
      </View>
    </View>
  );
};

const getMoodColor = (mood: PetMood): string => {
  switch (mood) {
    case 'Happy':
      return '#F4A0B0';
    case 'Sad':
      return '#A09090';
    case 'Asleep':
      return '#8B9FBE';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  petWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImage: {
    borderRadius: 24,
  },
  moodBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(212, 180, 144, 0.1)',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
});

export default PetDisplay;
