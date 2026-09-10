import type { IconType } from "react-icons";
import {
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandTelegram,
  TbDownload,
  TbLink,
  TbMail,
  TbPhone,
} from "react-icons/tb";
import type { ContactChannel, ContactChannelKind } from "../types/content";

/** Known brand links get their real logo; anything else falls back to a generic
 * glyph for its `kind` (see KIND_ICONS below). All Tabler (not Simple Icons) —
 * Simple Icons dropped LinkedIn, so Tabler's brand set keeps every icon in one
 * consistent outline style. */
const LABEL_ICONS: Record<string, IconType> = {
  github: TbBrandGithub,
  linkedin: TbBrandLinkedin,
  telegram: TbBrandTelegram,
};

const KIND_ICONS: Record<ContactChannelKind, IconType> = {
  email: TbMail,
  phone: TbPhone,
  link: TbLink,
  download: TbDownload,
};

function normalize(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function resolveContactIcon(channel: ContactChannel): IconType {
  return LABEL_ICONS[normalize(channel.label)] ?? KIND_ICONS[channel.kind];
}
