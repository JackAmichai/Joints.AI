/**
 * Plain bento card for a step's header + body. Animation is handled by
 * the assess layout's AnimatePresence wrapper so exits animate correctly
 * on route change.
 */
export function StepFrame({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bento bento-pad">
      <p className="text-xs font-medium uppercase tracking-wide text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-ink-muted">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
