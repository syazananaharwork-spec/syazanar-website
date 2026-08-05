import type { Todo as TodoValue } from "@/lib/content";

/**
 * Renders a bracketed placeholder as real, visible, selectable text —
 * flagged with a dashed underline so it's obvious in review. Never a
 * silent stand-in for invented copy.
 */
export function Todo({ value }: { value: TodoValue }) {
  return (
    <span
      className="border-b border-dashed border-accent/60 text-text-muted"
      title="TODO before launch"
    >
      [{value.text}]
    </span>
  );
}

export function isTodo(value: unknown): value is TodoValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "isTodo" in value &&
    (value as TodoValue).isTodo === true
  );
}
