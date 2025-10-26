import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Dumbbell, Leaf, ShieldCheck, Sparkles, Star } from "lucide-react";

const CHECKOUT_URL = "#"; // TODO: replace with your Stripe/LemonSqueezy checkout link

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border p-4 shadow-sm bg-white">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

export default function Home() {
  const [answers, setAnswers] = useState({
    name: "",
    email: "",
    gender: "male/female",
    age: "",
    height: "cm",
    weight: "kg",
    goal: "recomp",
    diet: "balanced",
    activity: "medium",
    equipment: "home",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generatePlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setPlan(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold tracking-tight md:text-5xl"
            >
              Personal Fitness & Nutrition — <span className="inline-flex items-center gap-2">Tailored <Sparkles className="h-6 w-6"/></span> For You
            </motion.h1>
            <p className="mt-4 text-gray-600 md:text-lg">
              No guesswork. Get a custom workout split and a calorie-macro meal plan aligned with your goals — in under 60 seconds.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <div className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4"/> Science-guided</div>
              <div className="inline-flex items-center gap-1"><Dumbbell className="h-4 w-4"/> Coach-approved</div>
              <div className="inline-flex items-center gap-1"><Leaf className="h-4 w-4"/> Real-food meals</div>
            </div>
            <div className="mt-8 flex gap-3">
              <a href="#quiz" className="inline-block rounded-xl bg-black text-white px-5 py-3 text-sm font-medium">Start Your Free Quiz</a>
              <a href="#how" className="inline-block rounded-xl border px-5 py-3 text-sm font-medium">How It Works</a>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-gray-200 shadow-lg bg-white">
              <div className="border-b px-4 py-3">
                <p className="font-semibold flex items-center gap-2"><Star className="h-5 w-5"/> Preview Your Plan</p>
              </div>
              <div className="p-4">
                {!plan ? (
                  <div className="text-gray-600">Fill the quiz and generate to preview your personalized plan here.</div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="font-medium">{plan.headline}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
                        <Stat label="Target kcal" value={plan.summary.targetCalories} />
                        <Stat label="Protein (g)" value={plan.summary.protein} />
                        <Stat label="Carbs (g)" value={plan.summary.carbs} />
                        <Stat label="Fats (g)" value={plan.summary.fats} />
                        <Stat label="Weekly days" value={plan.summary.days} />
                        <Stat label="TDEE (est)" value={plan.summary.tdee} />
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold">Sample Workouts</h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                        {plan.workouts.slice(0, 3).map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold">Sample Meals</h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                        {plan.meals.map((m, i) => (
                          <li key={i}><span className="font-medium">{m.title}:</span> {m.items[0]}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {["Lost 12 lbs in 6 weeks","Built visible muscle in 8 weeks","Finally consistent meals"].map((t, i) => (
            <div key={i} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-yellow-500">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-2 text-sm text-gray-700">“{t}. The plan fits my schedule and the meals are actually tasty.”</p>
              <p className="mt-2 text-xs text-gray-500">Verified member</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" className="mx-auto mt-16 max-w-4xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="border-b px-6 py-4">
            <p className="text-lg font-semibold">Quick Fitness Quiz (60s)</p>
          </div>
          <div className="p-6">
            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">First name</label>
                  <input id="name" name="name" placeholder="Alex" value={answers.name} onChange={handleChange} className="w-full rounded-md border p-2"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">Email (for your plan)</label>
                  <input id="email" name="email" placeholder="you@email.com" type="email" value={answers.email} onChange={handleChange} required className="w-full rounded-md border p-2"/>
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
                  <select id="gender" name="gender" value={answers.gender} onChange={handleChange} className="w-full rounded-md border p-2">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium">Age</label>
                <input id="age" name="age" type="number" min="16" max="90" value={answers.age} onChange={handleChange} required className="w-full rounded-md border p-2"/>
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium">Height (cm)</label>
                <input id="height" name="height" type="number" min="120" max="220" value={answers.height} onChange={handleChange} required className="w-full rounded-md border p-2"/>
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium">Weight (kg)</label>
                <input id="weight" name="weight" type="number" min="35" max="220" value={answers.weight} onChange={handleChange} required className="w-full rounded-md border p-2"/>
              </div>

              <div>
                <label htmlFor="goal" className="block text-sm font-medium">Primary goal</label>
                <select id="goal" name="goal" value={answers.goal} onChange={handleChange} className="w-full rounded-md border p-2">
                  <option value="lose">Fat loss</option>
                  <option value="gain">Muscle gain</option>
                  <option value="recomp">Recomposition</option>
                </select>
              </div>

              <div>
                <label htmlFor="diet" className="block text-sm font-medium">Diet preference</label>
                <select id="diet" name="diet" value={answers.diet} onChange={handleChange} className="w-full rounded-md border p-2">
                  <option value="balanced">Balanced</option>
                  <option value="keto">Keto</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label htmlFor="activity" className="block text-sm font-medium">Current activity</label>
                <select id="activity" name="activity" value={answers.activity} onChange={handleChange} className="w-full rounded-md border p-2">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="equipment" className="block text-sm font-medium">Equipment</label>
                <select id="equipment" name="equipment" value={answers.equipment} onChange={handleChange} className="w-full rounded-md border p-2">
                  <option value="home">Home / minimal</option>
                  <option value="gym">Full gym</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium">Injuries / constraints (optional)</label>
                <textarea id="notes" name="notes" placeholder="Knee sensitivity, no running, lactose-free..." value={answers.notes} onChange={handleChange} className="w-full rounded-md border p-2"/>
              </div>

              <div className="md:col-span-2 mt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Check className="h-4 w-4"/> You’ll see your tailored preview instantly.
                </div>
                <button type="submit" disabled={loading} className="rounded-xl bg-black text-white px-5 py-3 text-sm font-medium">
                  {loading ? "Generating..." : "Generate My Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results + CTA */}
      {plan && (
        <section className="mx-auto mt-12 max-w-4xl px-4">
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="border-b px-6 py-4">
              <p className="text-lg font-semibold">Your Custom 4-Week Plan</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
                <Stat label="Target kcal" value={plan.summary.targetCalories} />
                <Stat label="Protein (g)" value={plan.summary.protein} />
                <Stat label="Carbs (g)" value={plan.summary.carbs} />
                <Stat label="Fats (g)" value={plan.summary.fats} />
                <Stat label="Days/week" value={plan.summary.days} />
                <Stat label="TDEE" value={plan.summary.tdee} />
              </div>

              <div>
                <h4 className="mb-2 text-lg font-semibold">Weekly Workout Split</h4>
                <ul className="list-disc space-y-1 pl-5 text-gray-700">
                  {plan.workouts.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-lg font-semibold">Meal Outline</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {plan.meals.map((m, i) => (
                    <div key={i} className="rounded-xl border p-3">
                      <p className="font-medium">{m.title}</p>
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {m.items.map((it, j) => <li key={j}>{it}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a href={CHECKOUT_URL} target="_blank" rel="noreferrer" className="rounded-xl bg-black text-white px-5 py-3 text-sm font-medium">
                  Get Full PDF Plan – $9.99
                </a>
                <button onClick={() => window.print()} className="rounded-xl border px-5 py-3 text-sm font-medium">
                  Print / Save as PDF
                </button>
                <p className="text-xs text-gray-500">One-time purchase. Instant download.</p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-gray-500">
            Disclaimer: Educational purposes only. Not a substitute for professional medical advice. Consult your physician before beginning any program.
          </p>
        </section>
      )}

      {/* How it works */}
      <section id="how" className="mx-auto my-16 max-w-4xl px-4">
        <h3 className="mb-4 text-2xl font-semibold">How It Works</h3>
        <ol className="grid gap-3 md:grid-cols-3">
          {["Take the 60s quiz","We generate your tailored plan","Upgrade to full PDF & ongoing tips"].map((s, i) => (
            <li key={i} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">{i+1}</div>
              <p className="text-gray-700">{s}</p>
            </li>
          ))}
        </ol>
        {error && (<p className="mt-4 text-sm text-red-600">{error}</p>)}
      </section>

      <footer className="mx-auto mt-12 max-w-6xl px-4 pb-16 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} FitTailor. All rights reserved.
      </footer>
    </div>
  );
}
