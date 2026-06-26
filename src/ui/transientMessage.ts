import type { Dispatch, SetStateAction } from "react";

export type MessageTimerRef = {
  current: ReturnType<typeof window.setTimeout> | null;
};

export function showTransientMessage(
  setMessage: Dispatch<SetStateAction<string>> | ((message: string) => void),
  timerRef: MessageTimerRef,
  message: string,
  durationMs = 2500,
) {
  if (timerRef.current) window.clearTimeout(timerRef.current);
  setMessage(message);
  timerRef.current = window.setTimeout(() => {
    setMessage("");
    timerRef.current = null;
  }, durationMs);
}
