import { useEffect } from "react";
import type { Screen } from "../types/content";

const CODE_TO_SCREEN: Record<string, Screen> = {
  KeyZ: "hero",
  KeyX: "skills",
  KeyC: "contact",
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA"
  );
}

/** Global Z / X / C hotkeys to switch screens, disabled while typing.
 * Matched on `event.code` (physical key position) rather than `event.key` so the
 * hotkeys still work under non-Latin keyboard layouts (e.g. Cyrillic). */
export function useHotkeyNav(onNavigate: (screen: Screen) => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const screen = CODE_TO_SCREEN[event.code];
      if (screen) onNavigate(screen);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNavigate]);
}
