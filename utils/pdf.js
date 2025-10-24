import PDFDocument from "pdfkit";

export async function createPlanPDF({ name = "Athlete", summary = {}, workouts = [], meals = [], tips = [] }) {
  return await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text(`Personal Fitness & Nutrition Plan`, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Prepared for: ${name}`);
    doc.moveDown();

    doc.fontSize(16).text("Summary", { underline: true });
    doc.fontSize(12);
    const s = summary || {};
    const lines = [
      `Goal: ${s.goal || "-"}`,
      `Target Calories: ${s.targetCalories || "-"}`,
      `Protein (g): ${s.protein || "-"}`,
      `Carbs (g): ${s.carbs || "-"}`,
      `Fats (g): ${s.fats || "-"}`,
      `Training Days / Week: ${s.days || "-"}`,
      `TDEE (est): ${s.tdee || "-"}`,
    ];
    lines.forEach(l => doc.text("• " + l));
    doc.moveDown();

    doc.fontSize(16).text("Weekly Workout Split", { underline: true });
    doc.fontSize(12);
    (workouts || []).forEach(w => doc.text("• " + w));
    doc.moveDown();

    doc.fontSize(16).text("Meal Outline", { underline: true });
    doc.fontSize(12);
    (meals || []).forEach(m => {
      doc.text(`• ${m.title}: ${(m.items || []).join(", ")}`);
    });
    doc.moveDown();

    doc.fontSize(16).text("Key Tips", { underline: true });
    doc.fontSize(12);
    (tips || []).forEach(t => doc.text("• " + t));

    doc.moveDown(2);
    doc.fontSize(9).fillColor("#666").text("Disclaimer: Educational purposes only. Consult your physician before beginning any program.", { align: "center" });
    doc.end();
  });
}
