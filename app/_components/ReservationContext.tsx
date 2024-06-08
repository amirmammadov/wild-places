"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export interface ReservationState {
  from: Date | undefined;
  to: Date | undefined;
}

interface ReservationContextType {
  range: ReservationState;
  setRange: Dispatch<SetStateAction<ReservationState>>;
  resetRange: () => void;
}

const initialState: ReservationState = { from: undefined, to: undefined };

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined,
);

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState(initialState);

  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);

  if (context === undefined) {
    throw new Error("Context was used outside provider");
  }
  return context;
}

export { ReservationProvider, useReservation };
