import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

// G-force threshold for a shake is set to 1.5.
// This filters out minor device jitter while still detecting a deliberate shake.
const SHAKE_G_FORCE_THRESHOLD = 1.5;
const SHAKE_DEBOUNCE_MS = 500;

export function useAccelerometerGesture(onShake: () => void) {
  const lastTriggerRef = useRef(0);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let isMounted = true;

    const startListening = async () => {
      try {
        const isAvailable = await Accelerometer.isAvailableAsync();
        if (!isAvailable) {
          console.warn('Accelerometer not available on this device.');
          return;
        }

        const permissionResult = await Accelerometer.requestPermissionsAsync();
        if (permissionResult.status !== 'granted') {
          if (isMounted) {
            Alert.alert(
              'Motion permission needed',
              'Allow motion access so shake gestures can be detected.',
            );
          }
          return;
        }

        Accelerometer.setUpdateInterval(400);

        subscription = Accelerometer.addListener(({ x, y, z }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          const now = Date.now();

          // G-force magnitude is computed from the vector length across all axes.
          // A threshold of 1.5 filters out tremors while detecting a purposeful shake.
          if (magnitude >= SHAKE_G_FORCE_THRESHOLD) {
            const timeSinceLastTrigger = now - lastTriggerRef.current;

            // Prevent multiple triggers from a single continuous shake with a brief cooldown.
            if (timeSinceLastTrigger >= SHAKE_DEBOUNCE_MS) {
              lastTriggerRef.current = now;
              onShake();
            }
          }
        });
      } catch (error) {
        console.warn('Accelerometer gesture setup failed:', error);
      }
    };

    startListening();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, [onShake]);
}
