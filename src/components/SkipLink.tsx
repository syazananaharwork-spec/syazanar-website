export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only-until-focus fixed top-4 left-4 z-[100] rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-ink focus:outline-2 focus:outline-offset-2 focus:outline-glint"
    >
      Skip to main content
    </a>
  );
}
