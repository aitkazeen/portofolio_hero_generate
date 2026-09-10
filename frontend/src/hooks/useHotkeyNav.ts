import { useEffect } from "react";
import type { Screen } from "../types/content";

const KEY_TO_SCREEN: Record<string, Screen> = {
  h: "hero",
  s: "skills",
  c: "contact",
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA"
  );
}

/** Global H / S / C hotkeys to switch screens, disabled while typing. */
export function useHotkeyNav(onNavigate: (screen: Screen) => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const screen = KEY_TO_SCREEN[event.key.toLowerCase()];
      if (screen) onNavigate(screen);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNavigate]);
}
