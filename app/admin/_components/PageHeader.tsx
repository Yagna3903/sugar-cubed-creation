type Props = {
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  right?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  right,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {right}
        {ctaHref && ctaLabel && (
          <a
            href={ctaHref}
            className="rounded-xl bg-brand-brown px-4 py-2 text-white hover:opacity-90"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}
