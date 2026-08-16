import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetState } from '../types/pet';

const PET_STORAGE_KEY = 'pet_state_demo_1';

const initialPetState: PetState = {
  energy: 50,   // Starting at 50% for the demo
  hunger: 100, 
  happiness: 50, // Starting at 50% for the demo
  lastUpdated: Math.floor(Date.now() / 1000),
};

const PetContext = createContext<{
  pet: PetState;
  setPet: React.Dispatch<React.SetStateAction<PetState>>;
  depleteStats: () => PetState;
} | null>(null);

const clampStat = (value: number): number => Math.min(100, Math.max(0, value));

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pet, setPet] = useState<PetState>(initialPetState);

  useEffect(() => {
    // 1. Define the async function INSIDE the hook
    const loadPet = async () => {
      try {
        const storedPet = await AsyncStorage.getItem(PET_STORAGE_KEY);
        if (!storedPet) {
          return;
        }

        const parsedPet = JSON.parse(storedPet) as Partial<PetState>;

        if (
          parsedPet &&
          typeof parsedPet.energy === 'number' &&
          typeof parsedPet.hunger === 'number' &&
          typeof parsedPet.happiness === 'number' &&
          typeof parsedPet.lastUpdated === 'number'
        ) {
          setPet({
            energy: clampStat(parsedPet.energy),
            hunger: clampStat(parsedPet.hunger),
            happiness: clampStat(parsedPet.happiness),
            lastUpdated: parsedPet.lastUpdated,
          });
        }
      } catch (error) {
        console.warn('Failed to load pet state from storage', error);
      }
    };

    // 2. Call the function immediately
    loadPet();
  }, []);

  useEffect(() => {
    // Persist pet state to AsyncStorage on change
    try {
      AsyncStorage.setItem(PET_STORAGE_KEY, JSON.stringify(pet));
    } catch (error) {
      console.warn('Failed to persist pet state to storage', error);
    }
  }, [pet]);useEffect(() => {
    const savePet = async () => {
      try {
        await AsyncStorage.setItem(PET_STORAGE_KEY, JSON.stringify(pet));
      } catch (error) {
        console.warn('Failed to persist pet state to storage', error);
      }
    };

    savePet();
  }, [pet]);

  const depleteStats = () => {
    const now = Math.floor(Date.now() / 1000);
    
    // DEMO MODE: Calculate elapsed seconds instead of hours
    const elapsedSeconds = Math.max(0, now - pet.lastUpdated);

    if (elapsedSeconds <= 0) {
      return pet;
    }

    // DEMO SPEED: Drops stats by 1% every 2 seconds
    const depletionPercent = elapsedSeconds * 0.5; 

    const nextPet: PetState = {
      energy: clampStat(pet.energy - depletionPercent),
      hunger: clampStat(pet.hunger - depletionPercent),
      happiness: clampStat(pet.happiness - depletionPercent),
      lastUpdated: now,
    };

    setPet(nextPet);
    return nextPet;
  };

  const value = useMemo(
    () => ({
      pet,
      setPet,
      depleteStats,
    }),
    [pet]
  );

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};

export const usePetLogic = () => {
  const context = useContext(PetContext);

  if (!context) {
    throw new Error('usePetLogic must be used within a PetProvider');
  }

  return context;
};
