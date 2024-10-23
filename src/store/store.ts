import { create } from 'zustand';

export interface TowQuestions {
  accident: boolean | null;
  brokenAxle: boolean | null;
  wheelsIntact: boolean | null;
  unattended: boolean | null;
  keyWithVehicle: boolean | null;
  canPutInNeutral: boolean | null;
  locationType: string; 
  specialNotes: string;
   // Add these new fields for tire service
   hasWorkingSpare: boolean | null;
   hasWheelLockKey: boolean | null;
   areLugnutsStripped: boolean | null;
}

interface State {
  service: string;
  setService: (service: string) => void;
  pickupAddress: string;
  setPickupAddress: (pickupAddress: string) => void;
  dropOffAddress: string;
  setDropOffAddress: (dropOffAddress: string) => void;
  isLocationOpen: boolean | null;
  setIsLocationOpen: (isOpen: boolean | null) => void;
  hasNightDropBox: boolean | null;
  setHasNightDropBox: (hasBox: boolean | null) => void;
  carMake: string;
  setCarMake: (make: string) => void;
  carModel: string;
  setCarModel: (model: string) => void;
  carYear: string;
  setCarYear: (year: string) => void;
  carColor: string;
  setCarColor: (color: string) => void;
  towQuestions: TowQuestions;
  setTowQuestions: (questions: TowQuestions) => void;
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phoneNumber: string;
  setPhoneNumber: (number: string) => void;
  distance: string;
  estimatedTime: string;
  setDistance: (distance: string) => void;
  setEstimatedTime: (time: string) => void;
}

interface Actions {
  resetState: () => void;
}

export const useStore = create<State & Actions>((set) => ({
  service: '',
  setService: (service: string) => set({ service }),
  pickupAddress: '',
  setPickupAddress: (pickupAddress: string) => set({ pickupAddress }),
  dropOffAddress: '',
  setDropOffAddress: (dropOffAddress: string) => set({ dropOffAddress }),
  isLocationOpen: null,
  setIsLocationOpen: (isOpen: boolean | null) => set({ isLocationOpen: isOpen }),
  hasNightDropBox: null,
  setHasNightDropBox: (hasBox: boolean | null) => set({ hasNightDropBox: hasBox }),
  carMake: '',
  setCarMake: (make: string) => set({ carMake: make }),
  carModel: '',
  setCarModel: (model: string) => set({ carModel: model }),
  carYear: '',
  setCarYear: (year: string) => set({ carYear: year }),
  carColor: '',
  setCarColor: (color: string) => set({ carColor: color }),
  towQuestions: {
    accident: null,
    brokenAxle: null,
    wheelsIntact: null,
    unattended: null,
    keyWithVehicle: null,
    canPutInNeutral: null,
    locationType: '', 
    specialNotes: '', 
    hasWorkingSpare: null,
    hasWheelLockKey: null,
    areLugnutsStripped: null,
  },
  distance: '',
  setDistance: (distance: string) => set({ distance }),
  estimatedTime: '',
  setEstimatedTime: (time: string) => set({ estimatedTime: time }),
  setTowQuestions: (questions: TowQuestions) => set({ towQuestions: questions }),
  fullName: '',
  setFullName: (name: string) => set({ fullName: name }),
  email: '',
  setEmail: (email: string) => set({ email: email }),
  phoneNumber: '',
  setPhoneNumber: (number: string) => set({ phoneNumber: number }),
  resetState: () => set({
    dropOffAddress: '',
    isLocationOpen: null,
    hasNightDropBox: null,
    carMake: '',
    carModel: '',
    carYear: '',
    carColor: '',
    towQuestions: {
      accident: null,
      brokenAxle: null,
      wheelsIntact: null,
      unattended: null,
      keyWithVehicle: null,
      canPutInNeutral: null,
      locationType: '',
      specialNotes: '', // Add this line
      hasWorkingSpare: null,
      hasWheelLockKey: null,
      areLugnutsStripped: null,
    },
    fullName: '',
    email: '',
    phoneNumber: '',
    // Add any other state properties that need to be reset
  }),
}));
