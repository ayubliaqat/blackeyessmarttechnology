import type { Metadata } from "next";
import MeetingScheduler from "@/components/Booking/MeetingScheduler";

export const metadata: Metadata = {
  title: "Book a Free Consultation | BlackEyes Smart Technology",
  description:
    "Schedule a free consultation for CCTV, home automation, networking, fire alarm, intercom and sound systems.",
};

export default function MeetingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 sm:py-28">
      <MeetingScheduler />
    </main>
  );
}