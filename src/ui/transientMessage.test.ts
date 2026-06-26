import { afterEach, describe, expect, it, vi } from "vitest";
import { showTransientMessage, type MessageTimerRef } from "./transientMessage";

describe("showTransientMessage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("clears a message after the configured duration", () => {
    vi.useFakeTimers();
    const messages: string[] = [];
    const timerRef: MessageTimerRef = { current: null };
    const collectMessage = (message: string) => messages.push(message);

    showTransientMessage(collectMessage, timerRef, "已收藏哲人。", 2500);

    expect(messages).toEqual(["已收藏哲人。"]); 
    vi.advanceTimersByTime(2499);
    expect(messages).toEqual(["已收藏哲人。"]); 
    vi.advanceTimersByTime(1);
    expect(messages).toEqual(["已收藏哲人。", ""]);
    expect(timerRef.current).toBeNull();
  });

  it("replaces a previous timer when a new message appears", () => {
    vi.useFakeTimers();
    const messages: string[] = [];
    const timerRef: MessageTimerRef = { current: null };
    const collectMessage = (message: string) => messages.push(message);

    showTransientMessage(collectMessage, timerRef, "已收藏哲人。", 2500);
    vi.advanceTimersByTime(1000);
    showTransientMessage(collectMessage, timerRef, "已收藏论证。", 2500);
    vi.advanceTimersByTime(2499);

    expect(messages).toEqual(["已收藏哲人。", "已收藏论证。"]); 
    vi.advanceTimersByTime(1);
    expect(messages).toEqual(["已收藏哲人。", "已收藏论证。", ""]);
  });
});
