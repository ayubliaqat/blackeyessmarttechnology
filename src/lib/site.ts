import {
  Camera,
  Flame,
  Home,
  Network,
  PhoneCall,
  Volume2,
  type LucideIcon,
} from "lucide-react";

/* TODO: replace the contact placeholders below with real details */
export const SITE = {
  name: "BlackEyes Smart Technology",
  short: "BlackEyes",
  tagline:
    "CCTV, home automation, networking, fire alarm, intercom and sound systems. Professionally installed, supported 24/7.",
  logo: "/images/logo.png",
  /* Optional: path to a dark-colored logo for light mode, e.g. "/images/logo-light.png".
     Leave undefined to auto-tint the main logo dark in light mode. */
  logoLight: undefined as string | undefined,
  phone: "+00 000 000 0000",
  email: "info@yourdomain.com",
  address: "Your business address, City, Country",
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  href: string;
  icon: LucideIcon;
};

export const SERVICES: Service[] = [
  {
    slug: "cctv",
    title: "CCTV Surveillance",
    short: "HD cameras with remote viewing and recording.",
    href: "/services/cctv",
    icon: Camera,
  },
  {
    slug: "home-automation",
    title: "Home Automation",
    short: "Lighting, climate and access in one app.",
    href: "/services/home-automation",
    icon: Home,
  },
  {
    slug: "networking",
    title: "Networking",
    short: "Structured cabling, Wi-Fi and secure networks.",
    href: "/services/networking",
    icon: Network,
  },
  {
    slug: "fire-alarm",
    title: "Fire Alarm Systems",
    short: "Detection and alarm systems built to standard.",
    href: "/services/fire-alarm",
    icon: Flame,
  },
  {
    slug: "intercom",
    title: "Intercom Systems",
    short: "Audio and video entry for homes and offices.",
    href: "/services/intercom",
    icon: PhoneCall,
  },
  {
    slug: "sound-system",
    title: "Sound Systems",
    short: "Whole-space audio and public address.",
    href: "/services/sound-system",
    icon: Volume2,
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", children: SERVICES },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;

export const COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
  { label: "Get a Quote", href: "/quote" },
];

export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];