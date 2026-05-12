import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, User, Calendar, Clock, MapPin } from "lucide-react";
import { getAstrologyData, type PlanetPosition } from "../lib/api";

const PLANET_ICONS: Record<string, string> = {
  Sun: "☀️", Moon: "🌙", Mercury: "☿️", Venus: "♀️", Mars: "♂️",
  Jupiter: "♃", Saturn: "♄", Rahu: "☊", Ketu: "☋", Uranus: "⛢", Neptune: "♆", Pluto: "♇",
};

const FIELDS = [
  { key: "name", icon: User, placeholder: "Your Name", type: "text" },
  { key: "dob", icon: Calendar, placeholder: "Date of Birth", type: "date" },
  { key: "time", icon: Clock, placeholder: "Time of Birth", type: "time" },
  { key: "location", icon: MapPin, placeholder: "Birth Place", type: "text" },
] as const;

export function AstrologyPanel() {
  const [form, setForm] = useState({ name: "", dob: "", time: "", location: "" });
  const [planets, setPlanets] = useState<PlanetPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.name || !form.dob || !form.time || !form.location) {
      setError("Please fill all sacred fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await getAstrologyData(form);
      setPlanets(data.planets || []);
    } catch {
      setError("The cosmic gateway is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-4 space-y-4 border border-purple/20 shadow-[0_0_30px_var(--purple-glow)]">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.18_305/30%)] to-[oklch(0.65_0.18_305/10%)] flex items-center justify-center border border-purple/30">
          <Sparkles size={14} className="text-[oklch(0.78_0.15_305)]" />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-gradient-royal">Astrology</h3>
          <p className="text-[10px] text-muted-foreground">Vedic Planetary Reading</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {FIELDS.map(({ key, icon: Icon, placeholder, type }) => (
          <div key={key} className="relative group">
            <Icon
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
            />
            <input
              type={type}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              className="w-full bg-input/40 text-xs text-foreground placeholder:text-muted-foreground/70 rounded-lg pl-9 pr-3 py-2.5 outline-none border border-white/5 focus:border-primary/50 focus:bg-input/60 focus:shadow-[0_0_16px_var(--cyan-glow)] transition-all"
            />
          </div>
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 28px var(--cyan-glow)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary/30 via-primary/25 to-[oklch(0.65_0.18_305/25%)] hover:from-primary/40 hover:to-[oklch(0.65_0.18_305/35%)] text-foreground text-sm font-medium transition-all border border-primary/30 disabled:opacity-50"
      >
        {loading ? "Consulting the stars..." : "✨ Generate Horoscope"}
      </motion.button>

      <AnimatePresence>
        {planets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden pt-2"
          >
            {planets.map((p, i) => (
              <motion.div
                key={p.planet}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/30 transition-colors"
                onClick={() => setExpanded(expanded === p.planet ? null : p.planet)}
              >
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{PLANET_ICONS[p.planet] || "🪐"}</span>
                    <span className="text-xs font-medium text-foreground">{p.planet}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary">{p.sign}</span>
                    <ChevronDown
                      size={12}
                      className={`text-muted-foreground transition-transform ${expanded === p.planet ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                <AnimatePresence>
                  {expanded === p.planet && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3 pb-2.5 border-t border-white/5"
                    >
                      <div className="pt-2 flex justify-between text-xs text-muted-foreground">
                        <span>Degree: {p.degree?.toFixed(2)}°</span>
                        {p.retrograde && <span className="text-accent">Retrograde ↺</span>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
