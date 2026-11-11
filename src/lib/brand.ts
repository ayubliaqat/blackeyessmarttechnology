export const LOGO_SRC = "/images/logo.png";
export const BRAND_NAME = "BlackEyes Smart Technology";
export const BRAND_TAGLINE = "Security That Never Sleeps.";

// TODO: replace with your real details
export const CONTACT = {
  phone: "+00 000 000 0000",
  email: "info@yourdomain.com",
  address: "Your Street, City, Country",
  hours: "24/7 Support",
};

export const SERVICE_NAMES = [
  "CCTV",
  "Home Automation",
  "Networking",
  "Fire Alarm System",
  "Intercom System",
  "Sound System",
];

export type NavLink = { label: string; progress?: number; href?: string };

// progress = position inside the hero scroll (0..1)
export const NAV_LINKS: NavLink[] = [
  { label: "Home", progress: 0 },
  { label: "Services", progress: 0.535 },
  { label: "Why Us", progress: 0.95 },
  { label: "Contact", href: "#contact" },
];