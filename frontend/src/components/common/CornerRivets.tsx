import styles from "./CornerRivets.module.css";

interface CornerRivetsProps {
  size: number;
  inset: number;
  variant?: "bronze" | "gold";
}

const CORNERS = [
  { top: 0, left: 0 },
  { top: 0, right: 0 },
  { bottom: 0, left: 0 },
  { bottom: 0, right: 0 },
] as const;

/** Four decorative corner rivets, absolutely positioned inside a `position: relative` panel. */
export function CornerRivets({
  size,
  inset,
  variant = "bronze",
}: CornerRivetsProps) {
  return (
    <>
      {CORNERS.map((corner, i) => (
        <div
          key={i}
          className={`${styles.rivet} ${variant === "gold" ? styles["rivet--gold"] : styles["rivet--bronze"]}`}
          style={{
            width: size,
            height: size,
            top: "top" in corner ? inset : undefined,
            bottom: "bottom" in corner ? inset : undefined,
            left: "left" in corner ? inset : undefined,
            right: "right" in corner ? inset : undefined,
          }}
        />
      ))}
    </>
  );
}
