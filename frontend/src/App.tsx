import { useState } from "react";
import { ContentRegion } from "./components/layout/ContentRegion";
import { HudFrame } from "./components/layout/HudFrame";
import { StatusBar } from "./components/layout/StatusBar";
import { StatusMessage } from "./components/layout/StatusMessage";
import { TabBar } from "./components/layout/TabBar";
import { TopResourceBar } from "./components/layout/TopResourceBar";
import { ContactScreen } from "./components/screens/ContactScreen/ContactScreen";
import { HeroScreen } from "./components/screens/HeroScreen/HeroScreen";
import { SkillsScreen } from "./components/screens/SkillsScreen/SkillsScreen";
import { buildCardContent } from "./content/buildCardContent";
import { useHotkeyNav } from "./hooks/useHotkeyNav";
import { useProfile } from "./hooks/useProfile";
import type { Screen } from "./types/content";

const SCREEN_LABELS: Record<Screen, string> = {
  hero: "Hero — unit selected",
  skills: "Skills — attribute panel",
  contact: "Contact — quest log",
};

const SCREEN_INDEX: Record<Screen, number> = { hero: 1, skills: 2, contact: 3 };

export function App() {
  const [screen, setScreen] = useState<Screen>("hero");
  useHotkeyNav(setScreen);

  const query = useProfile();
  const screenLabel = SCREEN_LABELS[screen];

  if (query.status !== "success") {
    return (
      <HudFrame
        footerLeft="Digital business card — live API"
        footerRight={query.status === "error" ? "Uplink failed" : "Connecting…"}
      >
        <ContentRegion>
          {query.status === "loading" ? (
            <StatusMessage
              eyebrow="Establishing uplink"
              title="Loading campaign data…"
            />
          ) : (
            <StatusMessage
              eyebrow="Uplink failed"
              title="Could not reach the portfolio API"
              detail={query.message}
              onRetry={query.reload}
            />
          )}
        </ContentRegion>
      </HudFrame>
    );
  }

  const content = buildCardContent(query.profile);

  return (
    <HudFrame
      footerLeft="Mockup for React build — hotkeys Z / X / C switch screens"
      footerRight={`Screen ${SCREEN_INDEX[screen]} of 3 — ${screenLabel}`}
    >
      <TopResourceBar resources={content.resources} />
      <TabBar activeScreen={screen} onSelect={setScreen} />

      <ContentRegion>
        {screen === "hero" && <HeroScreen hero={content.hero} />}
        {screen === "skills" && (
          <SkillsScreen
            fullName={content.hero.fullName}
            title={content.hero.title}
            avatarUrl={content.hero.avatarUrl}
            level={content.hero.level}
            skills={content.skills}
          />
        )}
        {screen === "contact" && <ContactScreen contact={content.contact} />}
      </ContentRegion>

      <StatusBar
        activeScreen={screen}
        screenLabel={screenLabel}
        fullName={content.hero.fullName}
        avatarUrl={content.hero.avatarUrl}
        level={content.hero.level}
        healthPct={content.hero.healthPct}
        manaPct={content.hero.manaPct}
        onSelect={setScreen}
      />
    </HudFrame>
  );
}
