import { useState, type KeyboardEvent } from "react";
import { StatBar } from "../../common/StatBar";
import type { LogEntry } from "../../../types/content";
import { ExperienceModal } from "./ExperienceModal";
import { ProjectModal } from "./ProjectModal";
import styles from "./CampaignLog.module.css";

type LogView = "experience" | "projects";

const VIEW_META: Record<
  LogView,
  { title: string; toggleLabel: string; empty: string }
> = {
  experience: {
    title: "Campaign Log — Experience",
    toggleLabel: "View: Projects",
    empty: "No experience on record yet.",
  },
  projects: {
    title: "Campaign Log — Projects",
    toggleLabel: "View: Experience",
    empty: "No projects on record yet.",
  },
};

interface CampaignLogProps {
  experience: LogEntry[];
  projects: LogEntry[];
}

export function CampaignLog({ experience, projects }: CampaignLogProps) {
  const [view, setView] = useState<LogView>("experience");
  const [openEntry, setOpenEntry] = useState<LogEntry | null>(null);
  const [openProject, setOpenProject] = useState<LogEntry | null>(null);
  const entries = view === "experience" ? experience : projects;
  const meta = VIEW_META[view];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>{meta.title}</div>
        <button
          type="button"
          className={styles.toggle}
          onClick={() =>
            setView(view === "experience" ? "projects" : "experience")
          }
        >
          {meta.toggleLabel}
        </button>
      </div>
      <div className={styles.entries}>
        {entries.length === 0 && (
          <div className={styles.emptyState}>{meta.empty}</div>
        )}
        {entries.map((row) => {
          const isExperience = view === "experience";
          const isClickable = isExperience || Boolean(row.href);
          const openRow = () =>
            isExperience ? setOpenEntry(row) : setOpenProject(row);
          return (
            <div
              className={styles.entry}
              key={row.numeral}
              {...(isClickable
                ? {
                    onClick: openRow,
                    onKeyDown: (e: KeyboardEvent) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openRow();
                      }
                    },
                    role: "button",
                    tabIndex: 0,
                  }
                : {})}
            >
              <div className={styles.numeral}>{row.numeral}</div>
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <div className={styles.jobTitle}>{row.title}</div>
                  <div className={styles.period}>{row.period}</div>
                </div>
                <div className={styles.result}>{row.result}</div>
                <div className={styles.stack}>{row.stack}</div>
              </div>
              <div className={styles.rail}>
                <StatBar
                  pct={row.progressPct}
                  variant="xp"
                  height={8}
                  outline="idle"
                />
                <div className={styles.scope}>{row.scope}</div>
              </div>
            </div>
          );
        })}
      </div>
      {openEntry && (
        <ExperienceModal entry={openEntry} onClose={() => setOpenEntry(null)} />
      )}
      {openProject && (
        <ProjectModal
          entry={openProject}
          onClose={() => setOpenProject(null)}
        />
      )}
    </div>
  );
}
