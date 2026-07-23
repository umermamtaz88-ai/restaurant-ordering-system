"use client";

import { useEffect, useState } from "react";

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const EMPTY: CountdownResult = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isExpired: false,
};

function computeCountdown(targetDate: Date): CountdownResult {
  const diff = targetDate.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function useCountdown(targetIso: string): CountdownResult {
  // Stable SSR/client first paint — avoid Date.now() hydration mismatch
  const [countdown, setCountdown] = useState<CountdownResult>(EMPTY);

  useEffect(() => {
    const targetDate = new Date(targetIso);

    const tick = () => {
      if (document.hidden) return;
      setCountdown(computeCountdown(targetDate));
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    const onVisibility = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [targetIso]);

  return countdown;
}
