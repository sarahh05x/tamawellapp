import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';

export function usePedometer() {
  const [steps, setSteps] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);
  
  // Track the live subscription and the base steps from history
  const subscriptionRef = useRef<any>(null);
  const baseStepsRef = useRef(0);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        setHasPermissions(false);
        return false;
      }

      const status = await Pedometer.requestPermissionsAsync();
      setHasPermissions(status.granted);
      return status.granted;
    } catch (error) {
      console.warn('Pedometer permission request failed:', error);
      setHasPermissions(false);
      return false;
    }
  };

  const fetchTodaySteps = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0); // Start precisely at midnight today

      const data = await Pedometer.getStepCountAsync(start, end);
      const pastSteps = data?.steps ?? 0;
      
      // Save the historical base so our live listener can add to it
      baseStepsRef.current = pastSteps;
      setSteps(pastSteps);
    } catch (error) {
      console.warn('Unable to sync historical steps:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const permissionGranted = await requestPermissions();
      if (!permissionGranted || !mounted) return;

      // 1. Fetch steps from midnight up to this exact moment
      await fetchTodaySteps();

      // 2. Listen for new steps and add them to the base count
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }

      subscriptionRef.current = Pedometer.watchStepCount((result) => {
        // Add the live steps (result.steps) to the steps we already had today
        setSteps(baseStepsRef.current + result.steps);
      });
    };

    initialize();

    // 3. If the app goes to the background and comes back, refresh the daily total
    const appStateSubscription = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active' && mounted) {
        await fetchTodaySteps();
      }
    });

    return () => {
      mounted = false;
      appStateSubscription.remove();
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

    // 🏃‍♀️ DEMO MODE: AUTO-WALKER 🏃‍♀️
  // Delete or comment this out after the hackathon!
  useEffect(() => {
    const demoWalkingInterval = setInterval(() => {
      // Adds 15 steps every 1.5 seconds
      setSteps((currentSteps) => currentSteps + 15);
    }, 1500);

    return () => clearInterval(demoWalkingInterval);
  }, []);

  return { steps, hasPermissions };
}

