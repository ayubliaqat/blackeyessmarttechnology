import Image from "next/image";
import { SITE } from "@/lib/site";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

const WIDTH = 320;
const HEIGHT = 96;

export default function Logo({
  className = "h-12 w-auto md:h-16",
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/images/best-logo.png"
      alt={`${SITE.name} logo`}
      width={WIDTH}
      height={HEIGHT}
      priority={priority}
      className={`${className} object-contain object-left`}
    />
  );
}