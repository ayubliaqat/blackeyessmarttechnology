"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

type Slot = { start: string };
type SlotMap = Record<string, Slot[]>;
type Step = "pick" | "details" | "done";
type FetchResult = { key: string; slots: SlotMap; error: string };

const EMPTY_SLOTS: SlotMap = {};

const DEFAULT_TITLE = "Need help with digital security?";
const DEFAULT_DESC =
  "Book a free consultation and we'll plan the right solution with you for.";

const SERVICES = [
  "CCTV installation",
  "Home automation",
  "Networking",
  "Fire alarm",
  "Intercom",
  "Sound systems",
];

/* ───────── BlackEyes theme tokens ───────── */

const dark = {
  card: "border border-[#1CE8F0]/15 bg-white/[0.04] shadow-[0_8px_40px_-12px_rgba(28,232,240,0.14)] backdrop-blur-xl",
  inner: "border border-[#1CE8F0]/10 bg-white/[0.03]",
  heading: "text-[#F0F0F0]",
  muted: "text-[#AAB6C0]",
  accent: "text-[#1CE8F0]",
  line: "bg-[#1CE8F0]/20",
  divider: "border-[#1CE8F0]/15",
  iconBox: "bg-[#1CE8F0]/15 text-[#1CE8F0]",
  chip: "border border-[#1CE8F0]/20 bg-[#1CE8F0]/[0.06] text-[#AAB6C0]",
  btn: "bg-[#1CE8F0] text-[#000810] shadow-[0_0_30px_-6px_rgba(28,232,240,0.7)] hover:shadow-[0_0_44px_-4px_rgba(28,232,240,0.95)]",
  ghost: "border border-[#1CE8F0]/20 text-[#F0F0F0] hover:bg-[#1CE8F0]/10",
  sel: "border-[#1CE8F0] bg-[#1CE8F0] text-[#000810] shadow-[0_0_24px_-6px_rgba(28,232,240,0.8)]",
  dayOn: "bg-[#1CE8F0]/10 text-[#F0F0F0] hover:bg-[#1CE8F0]/25",
  today: "ring-1 ring-[#1CE8F0]/60",
  slot: "border-[#1CE8F0]/20 text-[#F0F0F0] hover:border-[#1CE8F0] hover:bg-[#1CE8F0]/10",
  input:
    "border border-[#1CE8F0]/15 bg-white/[0.04] text-[#F0F0F0] placeholder:text-[#AAB6C0]/60 focus:border-[#1CE8F0] focus:ring-[#1CE8F0]/30",
  stepOn: "bg-[#1CE8F0] text-[#000810]",
  stepOff: "border border-[#1CE8F0]/25 text-[#AAB6C0]",
};

const light: typeof dark = {
  card: "border border-[#07505A]/15 bg-white/80 shadow-[0_8px_40px_-12px_rgba(0,8,24,0.16)] backdrop-blur-xl",
  inner: "border border-[#07505A]/10 bg-[#07505A]/[0.04]",
  heading: "text-[#000810]",
  muted: "text-[#4B5B66]",
  accent: "text-[#07505A]",
  line: "bg-[#07505A]/20",
  divider: "border-[#07505A]/15",
  iconBox: "bg-[#07505A]/10 text-[#07505A]",
  chip: "border border-[#07505A]/20 bg-[#07505A]/[0.05] text-[#4B5B66]",
  btn: "bg-[#07505A] text-[#F0F0F0] shadow-[0_10px_30px_-10px_rgba(7,80,90,0.7)] hover:bg-[#0A6370] hover:shadow-[0_14px_36px_-10px_rgba(7,80,90,0.85)]",
  ghost: "border border-[#07505A]/20 text-[#000810] hover:bg-[#07505A]/10",
  sel: "border-[#07505A] bg-[#07505A] text-[#F0F0F0] shadow-[0_8px_24px_-8px_rgba(7,80,90,0.7)]",
  dayOn: "bg-[#07505A]/10 text-[#000810] hover:bg-[#07505A]/20",
  today: "ring-1 ring-[#07505A]/50",
  slot: "border-[#07505A]/20 text-[#000810] hover:border-[#07505A] hover:bg-[#07505A]/10",
  input:
    "border border-[#07505A]/20 bg-white text-[#000810] placeholder:text-[#4B5B66]/70 focus:border-[#07505A] focus:ring-[#07505A]/25",
  stepOn: "bg-[#07505A] text-[#F0F0F0]",
  stepOff: "border border-[#07505A]/25 text-[#4B5B66]",
};

type Theme = typeof dark;

const btn = (t: Theme) =>
  `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-40 ${t.btn}`;
const ghost = (t: Theme) =>
  `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${t.ghost}`;
const field = (t: Theme) =>
  `w-full rounded-2xl px-4 py-3 text-sm outline-none transition focus:ring-2 ${t.input}`;

/* ───────── Theme detection (follows your toggle live) ───────── */

let probeCtx: CanvasRenderingContext2D | null = null;

function backgroundIsDark(): boolean | null {
  if (!probeCtx) {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    probeCtx = c.getContext("2d", { willReadFrequently: true });
  }
  const ctx = probeCtx;
  if (!ctx) return null;

  for (const el of [document.body, document.documentElement]) {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = getComputedStyle(el).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    if (d[3] > 200) {
      return 0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2] < 128;
    }
  }
  return null;
}

function detectDark(): boolean {
  const el = document.documentElement;
  const marks = [
    ...Array.from(el.classList),
    el.getAttribute("data-theme"),
    el.getAttribute("data-mode"),
    el.getAttribute("data-color-scheme"),
  ];
  if (marks.includes("dark")) return true;
  if (marks.includes("light")) return false;

  const bg = backgroundIsDark();
  if (bg !== null) return bg;

  const cs = getComputedStyle(el).colorScheme;
  if (cs === "dark") return true;
  if (cs === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function subscribeTheme(cb: () => void) {
  const opts: MutationObserverInit = {
    attributes: true,
    attributeFilter: [
      "class",
      "data-theme",
      "data-mode",
      "data-color-scheme",
      "style",
    ],
  };
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, opts);
  mo.observe(document.body, opts);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

function useTheme(): Theme {
  const isDark = useSyncExternalStore(subscribeTheme, detectDark, () => true);
  return isDark ? dark : light;
}

/* ───────── Helpers ───────── */

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STEPS: { id: Step; label: string }[] = [
  { id: "pick", label: "Date & time" },
  { id: "details", label: "Your details" },
  { id: "done", label: "Confirmed" },
];
const GROUPS = [
  { label: "Morning", test: (h: number) => h >= 5 && h < 12 },
  { label: "Afternoon", test: (h: number) => h >= 12 && h < 17 },
  { label: "Evening", test: (h: number) => h >= 17 && h < 21 },
  { label: "Night", test: (h: number) => h >= 21 || h < 5 },
];

const pad = (n: number) => String(n).padStart(2, "0");
const toKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const subscribeNoop = () => () => {};
const getClientTz = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTz = () => "";

function Icon({
  d,
  className = "h-5 w-5",
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ICON = {
  left: "M15 18l-6-6 6-6",
  right: "M9 18l6-6-6-6",
  check: "M20 6L9 17l-5-5",
  chevron: "M6 9l6 6 6-6",
  clock: "M12 6v6l4 2M22 12a10 10 0 11-20 0 10 10 0 0120 0z",
  calendar:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
};

/* ───────── Scheduler ───────── */

function Scheduler({ t, onStep }: { t: Theme; onStep: () => void }) {
  const tz = useSyncExternalStore(subscribeNoop, getClientTz, getServerTz);

  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [step, setStep] = useState<Step>("pick");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchKey = tz ? `${tz}|${toKey(month)}|${nonce}` : "";
  const current = result && result.key === fetchKey ? result : null;
  const loading = !!fetchKey && !current;
  const slots = current?.slots ?? EMPTY_SLOTS;
  const error = current?.error ?? "";

  useEffect(() => {
    if (!fetchKey) return;
    const ctrl = new AbortController();

    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const start = first < today ? today : first;
    const qs = new URLSearchParams({
      start: toKey(start),
      end: toKey(last),
      timeZone: tz,
    });

    fetch(`/api/cal/slots?${qs}`, { signal: ctrl.signal })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Could not load available times");
        setResult({ key: fetchKey, slots: j.slots as SlotMap, error: "" });
      })
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        setResult({
          key: fetchKey,
          slots: {},
          error: e.message || "Could not load available times",
        });
      });

    return () => ctrl.abort();
  }, [fetchKey, month, tz, today]);

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const total = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    ).getDate();
    const offset = (first.getDay() + 6) % 7;
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from(
        { length: total },
        (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
      ),
    ];
  }, [month]);

  const timeLabel = useCallback(
    (iso: string) =>
      new Date(iso).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: tz,
      }),
    [tz]
  );
  const dateLabel = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: tz,
    });

  const grouped = useMemo(() => {
    const list = slots[selectedDate] ?? [];
    const hourFmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: tz,
    });
    return GROUPS.map((g) => ({
      label: g.label,
      items: list.filter((s) => g.test(Number(hourFmt.format(new Date(s.start))))),
    })).filter((g) => g.items.length > 0);
  }, [slots, selectedDate, tz]);

  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1);
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function goStep(s: Step) {
    setStep(s);
    onStep();
  }

  function changeMonth(delta: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
    setSelectedDate("");
    setSelectedSlot("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot || submitting) return;
    setSubmitting(true);
    setFormError("");
    try {
      const r = await fetch("/api/cal/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: selectedSlot,
          name,
          email,
          notes: notes || undefined,
          timeZone: tz,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Booking failed");
      goStep("done");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Booking failed");
      setNonce((n) => n + 1);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setSelectedDate("");
    setSelectedSlot("");
    setName("");
    setEmail("");
    setNotes("");
    setFormError("");
    setNonce((n) => n + 1);
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    goStep("pick");
  }

  if (!tz) {
    return <div className={`h-80 animate-pulse rounded-2xl ${t.inner}`} />;
  }

  return (
    <div>
      {/* Progress */}
      <ol className="mb-6 flex items-center gap-2 text-xs" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition ${
                i <= stepIndex ? t.stepOn : t.stepOff
              }`}
            >
              {i < stepIndex ? <Icon d={ICON.check} className="h-3 w-3" /> : i + 1}
            </span>
            <span
              className={`hidden sm:inline ${
                i === stepIndex ? `font-semibold ${t.heading}` : t.muted
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span className={`h-px w-6 sm:w-10 ${t.line}`} />
            )}
          </li>
        ))}
      </ol>

      <div key={step} className="be-fade">
        {step === "pick" && (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Calendar */}
            <div className={`rounded-2xl p-4 sm:p-5 ${t.inner}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`font-semibold ${t.heading}`}>
                  {month.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => changeMonth(-1)}
                    disabled={!canPrev}
                    className={`${ghost(t)} !p-2 disabled:pointer-events-none disabled:opacity-30`}
                  >
                    <Icon d={ICON.left} className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => changeMonth(1)}
                    className={`${ghost(t)} !p-2`}
                  >
                    <Icon d={ICON.right} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center sm:gap-1.5">
                {WEEKDAYS.map((w) => (
                  <span
                    key={w}
                    className={`pb-1 text-[10px] font-medium uppercase tracking-wide sm:text-[11px] ${t.muted}`}
                  >
                    {w}
                  </span>
                ))}
                {cells.map((d, i) => {
                  if (!d) return <span key={`b-${i}`} />;
                  const key = toKey(d);
                  const available = !loading && (slots[key]?.length ?? 0) > 0;
                  const selected = key === selectedDate;
                  const isToday = key === toKey(today);
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!available}
                      aria-pressed={selected}
                      onClick={() => {
                        setSelectedDate(key);
                        setSelectedSlot("");
                      }}
                      className={`aspect-square rounded-xl text-sm transition duration-200 ${
                        selected
                          ? `font-semibold ${t.sel}`
                          : available
                          ? `font-medium ${t.dayOn}`
                          : `cursor-not-allowed opacity-30 ${t.muted}`
                      } ${isToday && !selected ? t.today : ""} ${
                        loading ? "animate-pulse" : ""
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}
              {!loading && !error && Object.keys(slots).length === 0 && (
                <p className={`mt-4 text-sm ${t.muted}`}>
                  No availability this month. Try the next one.
                </p>
              )}

              <p className={`mt-4 flex items-center gap-2 text-xs ${t.muted}`}>
                <Icon d={ICON.clock} className="h-3.5 w-3.5" />
                Times shown in {tz}
              </p>
            </div>

            {/* Times */}
            <div className={`rounded-2xl p-4 sm:p-5 ${t.inner}`}>
              <h3 className={`mb-4 font-semibold ${t.heading}`}>
                {selectedDate
                  ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                      "en-GB",
                      { weekday: "long", day: "numeric", month: "long" }
                    )
                  : "Select a date"}
              </h3>

              {!selectedDate && (
                <p className={`text-sm ${t.muted}`}>
                  Pick an available day to see open times.
                </p>
              )}

              <div className="space-y-5">
                {grouped.map((g) => (
                  <div key={g.label}>
                    <p
                      className={`mb-2 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest ${t.muted}`}
                    >
                      {g.label}
                      <span className={`h-px flex-1 ${t.line}`} />
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                      {g.items.map((s) => (
                        <button
                          key={s.start}
                          type="button"
                          aria-pressed={s.start === selectedSlot}
                          onClick={() => setSelectedSlot(s.start)}
                          className={`rounded-xl border px-2 py-2.5 text-[13px] font-medium transition duration-200 sm:text-sm ${
                            s.start === selectedSlot ? t.sel : t.slot
                          }`}
                        >
                          {timeLabel(s.start)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled={!selectedSlot}
                onClick={() => goStep("details")}
                className={`${btn(t)} mt-6 w-full`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={submit} className="mx-auto max-w-xl space-y-4">
            <div
              className={`flex items-center justify-between gap-3 rounded-2xl p-4 ${t.inner}`}
            >
              <div>
                <p className={`text-sm font-semibold ${t.heading}`}>
                  {dateLabel(selectedSlot)}
                </p>
                <p className={`text-sm ${t.accent}`}>
                  {timeLabel(selectedSlot)} · 30 min
                </p>
              </div>
              <button
                type="button"
                onClick={() => goStep("pick")}
                className={`text-sm font-medium underline-offset-4 hover:underline ${t.accent}`}
              >
                Change
              </button>
            </div>

            <input
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              className={field(t)}
            />
            <input
              required
              type="email"
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className={field(t)}
            />
            <textarea
              rows={4}
              maxLength={1000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What do you need help with? (e.g. 4 CCTV cameras for my home)"
              className={`${field(t)} resize-none`}
            />

            {formError && (
              <p className="text-sm text-red-500" role="alert">
                {formError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => goStep("pick")}
                className={ghost(t)}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`${btn(t)} flex-1`}
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="mx-auto max-w-md py-6 text-center">
            <span
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border ${t.sel}`}
            >
              <Icon d={ICON.check} className="h-8 w-8" />
            </span>
            <h3 className={`text-xl font-semibold ${t.heading}`}>
              You&apos;re booked
            </h3>
            <p className={`mt-2 text-sm ${t.muted}`}>
              {dateLabel(selectedSlot)} at {timeLabel(selectedSlot)}
            </p>
            <p className={`mt-1 text-sm ${t.muted}`}>
              A confirmation has been sent to {email}.
            </p>
            <button type="button" onClick={reset} className={`${ghost(t)} mt-6`}>
              Book another time
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── Public component: card → expands in place ───────── */

type Props = {
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export default function MeetingScheduler({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  buttonLabel = "Book a Meeting",
}: Props) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyId = useId();

  const scrollToCard = useCallback(() => {
    window.setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setMounted(true);
    setOpen(true);
    scrollToCard();
  }

  return (
    <div ref={cardRef} className={`scroll-mt-24 rounded-3xl p-5 sm:p-8 ${t.card}`}>
      <style>{`
        @keyframes beFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .be-fade{animation:beFade .45s ease both}
        @media (prefers-reduced-motion:reduce){.be-fade{animation:none}}
      `}</style>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${t.iconBox}`}
          >
            <Icon d={ICON.calendar} className="h-6 w-6" />
          </span>
          <div>
            <h2 className={`text-xl font-semibold sm:text-2xl ${t.heading}`}>
              {title}
            </h2>
            <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${t.muted}`}>
              {description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <li
                  key={s}
                  className={`rounded-full px-3 py-1 text-xs ${t.chip}`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={bodyId}
          className={`${btn(t)} w-full shrink-0 lg:w-auto`}
        >
          {open ? "Close" : buttonLabel}
          <Icon
            d={ICON.chevron}
            className={`h-4 w-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        id={bodyId}
        inert={!open}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`mt-6 border-t pt-6 ${t.divider}`}>
            {mounted && <Scheduler t={t} onStep={scrollToCard} />}
          </div>
        </div>
      </div>
    </div>
  );
}