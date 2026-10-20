import {
  Activity,
  Bell,
  ChartLine,
  Globe,
  Lock,
  Server,
  Shield,
  Zap,
} from "lucide-react";

/**
 * Twin-style concentric dashed orbits with floating monitoring icons.
 * Decorative only — AROLAGB Uptime themed (no fabricated people/stats).
 */
export function HeroOrbit() {
  const rings = [
    { size: "min(420px, 55vw)", opacity: 0.2 },
    { size: "min(620px, 78vw)", opacity: 0.15 },
    { size: "min(820px, 100vw)", opacity: 0.11 },
    { size: "min(1020px, 122vw)", opacity: 0.08 },
    { size: "min(1220px, 145vw)", opacity: 0.05 },
  ];

  // Keep icons on the outer edges only — never over the centered headline
  const icons = [
    { Icon: Globe, label: "HTTP monitoring", className: "left-[6%] top-[14%]" },
    { Icon: Lock, label: "SSL checks", className: "right-[6%] top-[14%]" },
    { Icon: ChartLine, label: "Analytics", className: "left-[3%] top-[36%]" },
    { Icon: Zap, label: "Keyword checks", className: "right-[3%] top-[36%]" },
    { Icon: Bell, label: "Alerts", className: "left-[5%] top-[58%]" },
    { Icon: Activity, label: "Uptime pulse", className: "right-[5%] top-[56%]" },
    { Icon: Server, label: "TCP ports", className: "left-[8%] bottom-[10%]" },
    { Icon: Shield, label: "Security", className: "right-[8%] bottom-[10%]" },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2">
        {rings.map((ring) => (
          <div
            key={ring.size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#F9F6F0]"
            style={{
              width: ring.size,
              height: ring.size,
              opacity: ring.opacity,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(36,32,23,0.05)_0%,rgba(36,32,23,0.45)_42%,rgba(36,32,23,0.88)_100%)]" />

      {icons.map(({ Icon, label, className }) => (
        <div
          key={label}
          className={`absolute hidden sm:flex ${className} h-11 w-11 items-center justify-center rounded-2xl border border-[#F9F6F0]/15 bg-[#F9F6F0]/10 text-[#F9F6F0] shadow-lg shadow-black/25 backdrop-blur-[2px]`}
          title={label}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FFDA40]/12 to-transparent" />
    </div>
  );
}
