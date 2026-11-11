import { ArrowUpRight } from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
};

export default function WowButton({
  href,
  children,
  size = "md",
  onClick,
  className = "",
}: Props) {
  const sm = size === "sm";

  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative inline-flex items-center overflow-hidden rounded-full bg-electric font-display font-semibold text-midnight shadow-[0_0_28px_rgba(28,232,240,0.45)] ring-1 ring-white/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_52px_rgba(28,232,240,0.85)] ${
        sm
          ? "gap-2.5 py-1.5 pl-5 pr-1.5 text-[13px]"
          : "gap-4 py-2 pl-8 pr-2 text-sm md:text-base"
      } ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 animate-[shimmer_3.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
      <span className="relative">{children}</span>
      <span
        className={`relative flex items-center justify-center rounded-full bg-midnight text-electric transition-transform duration-300 group-hover:rotate-45 ${
          sm ? "size-8" : "size-10 md:size-11"
        }`}
      >
        <ArrowUpRight className={sm ? "size-4" : "size-5"} />
      </span>
    </a>
  );
}