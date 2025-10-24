export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const a = req.body || {};

  if (!a.email || !a.age || !a.height || !a.weight) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  function rulesBasedPlan(a) {
    const isMale = a.gender === "male";
    const h = Number(a.height), w = Number(a.weight), age = Number(a.age);
    const bmr = isMale ? 10*w + 6.25*h - 5*age + 5 : 10*w + 6.25*h - 5*age - 161;
    const act = { low: 1.2, medium: 1.5, high: 1.75 };
    const tdee = Math.round(bmr * (act[a.activity] || 1.4));
    const deficit = a.goal === "lose" ? 450 : 0;
    const surplus = a.goal === "gain" ? 300 : 0;
    const targetCalories = Math.max(1200, tdee - deficit + surplus);
    const proteinPerKg = a.goal === "gain" ? 2.0 : a.goal === "lose" ? 1.8 : 1.6;
    const protein = Math.round(proteinPerKg * Number(a.weight));
    const fats = Math.round(0.8 * Number(a.weight));
    const fatCalories = fats * 9;
    const proteinCalories = protein * 4;
    const carbs = Math.max(0, Math.round((targetCalories - fatCalories - proteinCalories) / 4));
    const gym = a.equipment === "gym";
    const days = a.goal === "gain" ? 5 : a.goal === "lose" ? 4 : 4;
    const split = gym
      ? (a.goal === "gain"
        ? ["Day 1 – Upper Push: Bench press, Incline DB press, Shoulder press, Triceps dips",
           "Day 2 – Lower: Back squat, Romanian deadlift, Walking lunges, Calf raises",
           "Day 3 – Upper Pull: Pull-ups, Barbell row, Face pulls, Biceps curls",
           "Day 4 – Full Body: Deadlift, Bulgarian split squat, Push-ups, Lat pulldown",
           "Day 5 – Conditioning: Intervals bike/rower + core circuit"]
        : ["Day 1 – Full Body A: Goblet squats, Push-ups, One-arm row, Planks",
           "Day 2 – Conditioning: 25–35 min zones 2–3 + 8×20s sprints",
           "Day 3 – Full Body B: Leg press, DB bench, Lat pulldown, Cable woodchops",
           "Day 4 – Conditioning: 30–40 min zone 2 + core + mobility"])
      : ["Day 1 – Home A: Split squats, Elevated push-ups, Backpack rows, Hollow holds",
         "Day 2 – Cardio: 30–35 min brisk walk/jog + 6×20s strides",
         "Day 3 – Home B: Hip hinges, Pike push-ups, Single-leg RDL, Side planks",
         "Day 4 – Cardio: 30–40 min cycle/jump rope + mobility"];
    const breakfast = a.diet === "vegan" ? "Tofu scramble + oatmeal with berries" : a.diet === "keto" ? "Omelet with spinach, avocado, feta" : "Greek yogurt, granola, banana, peanut butter";
    const lunch = a.diet === "vegan" ? "Lentil bowl: quinoa, roasted veggies, tahini" : a.diet === "keto" ? "Chicken salad: olive oil, avocado, nuts" : "Chicken rice bowl: jasmine rice, grilled chicken, salad";
    const dinner = a.diet === "vegan" ? "Chickpea pasta + tomato sauce + salad" : a.diet === "keto" ? "Salmon + asparagus + cauliflower mash" : "Beef stir-fry + veggies + basmati rice";
    const nameLine = a.name ? `${a.name}, here’s your personalized plan.` : "Here’s your personalized plan.";
    return {
      headline: nameLine,
      summary: { goal: a.goal, targetCalories, protein, carbs, fats, tdee, days },
      workouts: split,
      meals: [
        { title: "Breakfast", items: [breakfast] },
        { title: "Lunch", items: [lunch] },
        { title: "Dinner", items: [dinner] },
        { title: "Snacks", items: ["Protein shake", "Mixed nuts", "Fruit"] },
      ],
      tips: [
        "Aim for 7–8h sleep; recovery drives results.",
        "Hit daily step target: 8–10k steps.",
        "Progressive overload: add small weight/reps weekly.",
        "Hydration: ~30–35 ml/kg bodyweight.",
      ],
    };
  }

  const plan = rulesBasedPlan(a);

  // Optional LLM enrichment (commented)
  // if (process.env.OPENAI_API_KEY) { ... }

  return res.status(200).json(plan);
}
