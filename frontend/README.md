# Frontend

React + TypeScript + Vite UI for the digital business card, styled as a Warcraft III
(Human faction / Lordaeron) in-game HUD. Recreated from the design handoff in
`claude_design/design_handoff_lordaeron_hud_portfolio/` (gitignored source-of-truth
prototype — see that folder's `README.md` for the full spec).

## Commands

- `npm run dev` — Vite dev server (http://localhost:5173).
- `npm run build` — type-check (`tsc -b`) then production build.
- `npm run preview` — preview the production build locally.
- `npm run lint` — ESLint.

## Structure

```
src/
  main.tsx              React entry point
  App.tsx                top-level screen state (hero/skills/contact) + hotkey wiring
  styles/
    tokens.css            design tokens as CSS custom properties (colors, type, spacing)
    global.css             reset + emberPulse keyframes
  types/content.ts        content shapes (HeroContent, SkillsContent, ContactContent, ...)
  content/placeholders.ts placeholder copy — replace once wired to the GraphQL API
  hooks/useHotkeyNav.ts   global H/S/C screen-switch hotkeys
  components/
    common/                 shared primitives: StatBar, ArchedPortrait, CornerRivets
    layout/                 persistent chrome: HudFrame, TopResourceBar, TabBar,
                            StatusBar (Minimap + Nameplate + CommandCard), ContentRegion
    screens/
      HeroScreen/           portrait panel, parchment intro scroll, campaign log (experience)
      SkillsScreen/          attribute panel, tech-stack "arsenal" grid
      ContactScreen/        quest-log contact channels, build queue, standing orders
  assets/hud/             stone-texture.png, frame-h.png, frame-v.png
```

## Known placeholders / TODO before shipping

- All copy in `content/placeholders.ts` is placeholder text from the design handoff —
  swap for the real profile once this app queries the backend's GraphQL API.
- `assets/hud/frame-h.png` and `frame-v.png` were cropped from a reference screenshot
  for layout purposes only — **replace with licensed or originally produced frame art**
  before shipping (per the design handoff's asset notes). `stone-texture.png` is
  generated art and is safe to keep.
- Fonts load from Google Fonts (`index.html`) — self-host before shipping.
- No responsive breakpoint below ~800px yet (spec calls for stacking the two-column
  screens to a single column; not designed).
- No loading/error/form states — there is no data fetching yet.
