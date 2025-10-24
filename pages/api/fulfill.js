import Stripe from "stripe";
import { Resend } from "resend";
import { createPlanPDF } from "../../utils/pdf";

export const config = { api: { bodyParser: false } };

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;
    const name = session.customer_details?.name || "Athlete";

    try {
      const pdfBuffer = await createPlanPDF({
        name,
        summary: { goal: "Your goal", targetCalories: "-", protein: "-", carbs: "-", fats: "-", days: 4, tdee: "-" },
        workouts: ["Full Body A", "Conditioning", "Full Body B", "Mobility & Core"],
        meals: [{ title: "Breakfast", items: ["Greek yogurt + berries"] }, { title: "Lunch", items: ["Chicken rice bowl"] }, { title: "Dinner", items: ["Salmon + veggies"] }],
        tips: ["Sleep 7–8h", "10k steps", "Hydrate well"],
      });

      await resend.emails.send({
        from: process.env.SENDER_EMAIL || "Coach <coach@yourdomain.com>",
        to: email,
        subject: "Your Full Fitness & Nutrition Plan",
        html: `<p>Hi ${name},</p><p>Thanks for your purchase! Your full plan is attached as a PDF.</p><p>To your success,<br/>Coach</p>`,
        attachments: [{ filename: "Your-Plan.pdf", content: pdfBuffer.toString("base64") }],
      });
    } catch (e) {
      console.error("Send email failed:", e);
    }
  }

  res.json({ received: true });
}
