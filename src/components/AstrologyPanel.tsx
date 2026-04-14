import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import { getAstrologyData, type PlanetPosition } from "../lib/api";

const PLANET_ICONS: Record<string, string> = {
  Sun: "☀️", Moon: "🌙", Mercury: "☿️", Venus: "♀️", Mars: "♂️",
  Jupiter: "♃", Saturn: "♄", Rahu: "☊", Ketu: "☋", Uranus: "⛢", Neptune: "♆", Pluto: "♇",
};

export function AstrologyPanel() {
  const [form, setForm] = useState({ name: "", dob: "", time: "", location: "" });
  const [planets, setPlanets] = useState<PlanetPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.name || !form.dob || !form.time || !form.location) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await getAstrologyData(form);
      setPlanets(data.planets || []);
    } catch {
      setError("Failed to generate horoscope. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-sm font-semibold text-gold flex items-center gap-2">
        <Sparkles size={14} /> Astrology Calculator
      </h3>

      <div className="space-y-2">
        {(["name", "dob", "time", "location"] as const).map((field) => (
          <input
            key={field}
            type={field === "dob" ? "date" : field === "time" ? "time" : "text"}
            placeholder={field === "dob" ? "Date of Birth" : field === "time" ? "Time of Birth" : field === "location" ? "Birth Place" : "Name"}
            value={form[field]}
            onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
            className="w-full bg-input/50 text-sm text-foreground placeholder:text-muted-foreground rounded-lg px-3 py-2 outline-none border border-border/50 focus:border-primary/50 transition-colors"
          />
        ))}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium transition-colors border border-primary/20 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Horoscope"}
      </motion.button>

      <AnimatePresence>
        {planets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {planets.map((p) => (
              <motion.div
                key={p.planet}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl overflow-hidden cursor-pointer group"
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
                      className="px-3 pb-2.5 border-t border-border/30"
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
