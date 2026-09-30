import { INTAKE_SECTIONS, INTAKE_INTRO, INTAKE_CONSENT_LABEL, INTAKE_CONSENT_VERSION, INTAKE_DISCLAIMER, type IntakeSection } from "./intake";

export const COACHING_SERVICES = ["personal-training", "nutrition-coaching"] as const;
export type CoachingService = (typeof COACHING_SERVICES)[number];

export const COACHING_CHOICES: readonly { service: CoachingService; number: string; tag: string; title: string; emphasis: string; description: string; action: string; caption: string }[] = [
  { service: "personal-training", number: "01", tag: "MOVE WITH PURPOSE", title: "PERSONAL", emphasis: "TRAINING", description: "Your goals. Your pace. A stronger you.", action: "LET’S BUILD", caption: "STRENGTH / MOVEMENT / CONSISTENCY" },
  { service: "nutrition-coaching", number: "02", tag: "FUEL THE CHANGE", title: "NUTRITION", emphasis: "COACHING", description: "Real food. Better habits. Your everyday.", action: "LET’S FUEL", caption: "FOOD / HABITS / EVERYDAY ENERGY" },
];

export function isCoachingService(value: unknown): value is CoachingService {
  return COACHING_SERVICES.some((service) => service === value);
}

/** New nutrition questions are a draft for owner review; the existing intake gate covers both paths. */
export const NUTRITION_SECTIONS: readonly IntakeSection[] = [
  INTAKE_SECTIONS[0],
  {
    id: "nutrition-goals", title: "Your Goals",
    intro: "Start with what matters to you. There is no perfect answer.",
    questions: [
      { id: "nutritionGoals", type: "multi", label: "What would you like support with? (Select up to 3)", required: true, maxSelect: 3, options: [
        { value: "habits", label: "Build consistent eating habits" },
        { value: "energy", label: "Support everyday energy" },
        { value: "performance", label: "Fuel training and recovery" },
        { value: "weight", label: "Work toward a weight-related goal" },
        { value: "planning", label: "Make meal planning easier" },
        { value: "confidence", label: "Feel more confident with food choices" },
      ] },
      { id: "nutritionSuccess", type: "textarea", label: "What would meaningful progress look like for you over the next 3 to 6 months?", required: true, max: 2000 },
      { id: "nutritionHurdle", type: "textarea", label: "What tends to get in the way?", required: true, max: 2000 },
    ],
  },
  {
    id: "eating", title: "Your Eating Routine",
    questions: [
      { id: "typicalDay", type: "textarea", label: "Walk me through a typical day of meals, snacks and drinks.", required: true, max: 2000 },
      { id: "foodPreferences", type: "textarea", label: "What foods do you enjoy, avoid, or choose for cultural or personal reasons?", required: true, max: 2000 },
      { id: "foodAllergies", type: "textarea", label: "Do you have any food allergies or intolerances?", required: true, max: 2000, hint: "Write “None” if not applicable." },
      { id: "foodPreparation", type: "radio", label: "How do you usually get your meals?", required: true, options: [
        { value: "home", label: "Mostly cook at home" }, { value: "prepared", label: "Mostly prepared meals or eating out" }, { value: "mix", label: "A mix of both" },
      ] },
    ],
  },
  {
    id: "nutrition-lifestyle", title: "Your Lifestyle & Health",
    questions: [
      ...INTAKE_SECTIONS[2].questions.filter((q) => ["exerciseDays", "stress", "sleep"].includes(q.id)),
      { id: "nutritionHealth", type: "textarea", label: "Are there health conditions, medications, supplements or clinician-provided dietary instructions you would like me to consider?", required: false, max: 2000, hint: "Share only what you are comfortable including here." },
      { id: "nutritionCare", type: "textarea", label: "Are you currently working with a dietitian or another healthcare professional on your nutrition?", required: false, max: 2000 },
    ],
  },
  {
    id: "nutrition-support", title: "Making It Work",
    questions: [
      { id: "mealLogistics", type: "textarea", label: "What should I know about your schedule, food budget and access to a kitchen?", required: true, max: 2000 },
      { id: "nutritionSupport", type: "radio", label: "What kind of support feels most helpful?", required: true, options: [
        { value: "structure", label: "Clear structure and accountability" }, { value: "education", label: "Understanding the why behind my choices" }, { value: "gradual", label: "Small changes and encouragement" },
      ] },
      { id: "anythingElse", type: "textarea", label: "Is there anything else you want me to know?", required: false, max: 2000 },
    ],
  },
];

export function getCoachingIntake(service: CoachingService) {
  if (service === "nutrition-coaching") return {
    title: "Nutrition Coaching", eyebrow: "FUEL YOUR EVERYDAY", sections: NUTRITION_SECTIONS,
    intro: "Your food. Your routine. Your starting point. Tell me a little about your everyday life so we can build habits that fit it.",
    consent: "I understand this form collects personal and health information to inform my nutrition coaching. Coaching does not replace medical care or advice from a registered dietitian. I confirm my answers are accurate.",
    consentVersion: "2026-09-nutrition-draft-1",
    disclaimer: "Nutrition coaching supports everyday habits. For medical conditions or prescribed diets, continue to follow your healthcare professional’s guidance.",
  };
  return { title: "Personal Training", eyebrow: "BUILD YOUR STRONG", sections: INTAKE_SECTIONS, intro: INTAKE_INTRO, consent: INTAKE_CONSENT_LABEL, consentVersion: INTAKE_CONSENT_VERSION, disclaimer: INTAKE_DISCLAIMER };
}
