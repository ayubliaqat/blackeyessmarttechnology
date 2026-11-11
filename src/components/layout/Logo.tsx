import Image from "next/image";
import { SITE } from "@/lib/site";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

const WIDTH = 320;
const HEIGHT = 96;

/**
 * Dark mode: original logo.
 * Light mode: SITE.logoLight if provided, otherwise the same logo is painted
 * in the light-theme brand cyan (--accent, #07505a) through a CSS mask, so the
 * color is exact and readable on the light background.
 * The mask needs a logo with a transparent background (PNG or SVG).
 */
export default function Logo({
  className = "h-12 w-auto md:h-16",
  priority = false,
}: LogoProps) {
  const alt = `${SITE.name} logo`;

  if (SITE.logoLight) {
    return (
      <>
        <Image
          src={SITE.logo}
          alt={alt}
          width={WIDTH}
          height={HEIGHT}
          priority={priority}
          className={`${className} logo-dark object-contain object-left`}
        />
        <Image
          src={SITE.logoLight}
          alt={alt}
          width={WIDTH}
          height={HEIGHT}
          priority={priority}
          className={`${className} logo-light object-contain object-left`}
        />
      </>
    );
  }

  const logo = SITE.logo as string | { src: string };
  const maskUrl = `url("${typeof logo === "string" ? logo : logo.src}")`;

  return (
    <>
      <Image
        src={SITE.logo}
        alt={alt}
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        className={`${className} logo-dark object-contain object-left`}
      />
      <span
        role="img"
        aria-label={alt}
        className={`${className} logo-light`}
        style={{
          aspectRatio: `${WIDTH} / ${HEIGHT}`,
          backgroundColor: "var(--accent)",
          WebkitMaskImage: maskUrl,
          maskImage: maskUrl,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "left center",
          maskPosition: "left center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </>
  );
}